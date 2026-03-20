'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';

export default function AssignmentOutput() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAssignment();

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl);
    socket.on('assignment-update', (data) => {
      if (data.id === id) {
        if (data.status === 'completed' || data.status === 'failed') {
          fetchAssignment();
        } else {
          setAssignment((prev: any) => prev ? { ...prev, status: data.status } : null);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/assignments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAssignment(data.assignment);
      } else {
        // Fallback mock
        setAssignment({
          _id: id,
          title: 'Mocked Assignment',
          status: 'processing',
          generatedPaper: null
        });
        
        // Mock a completion event after 3 seconds
        setTimeout(() => {
          setAssignment({
            _id: id,
            title: 'Mocked Assignment',
            status: 'completed',
            generatedPaper: {
              sections: [
                {
                  title: 'Section A',
                  instruction: 'Short Answer Questions. Attempt all questions. Each question carries 2 marks',
                  questions: [
                    { text: 'Define electroplating. Explain its purpose.', difficulty: 'Easy', marks: 2 },
                    { text: 'What is the role of a conductor in the process of electrolysis?', difficulty: 'Moderate', marks: 2 },
                    { text: 'How is sodium hydroxide prepared during the electrolysis of brine?', difficulty: 'Challenging', marks: 2 },
                  ]
                }
              ]
            }
          });
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-pulse" size={40} /></div>;

  if (!assignment) return <div>Assignment not found.</div>;

  if (assignment.status === 'pending' || assignment.status === 'processing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={60} color="#FF5A36" style={{ animation: 'spin 1s linear infinite', marginBottom: '24px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Generating Question Paper...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Our AI is carefully crafting questions based on your requirements. This might take a minute.</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (assignment.status === 'failed') {
    return <div style={{ textAlign: 'center', color: 'red', padding: '40px' }}>Generation failed. Please try again.</div>;
  }

  const paper = assignment.generatedPaper;

  return (
    <div className="animate-fade-in" style={{ 
      background: '#2C2C2E', 
      borderRadius: 'var(--radius-lg)', 
      padding: '24px',
      minHeight: '100%',
      color: '#fff'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '15px', marginBottom: '16px', lineHeight: 1.5 }}>
          Certainly! Here is customized Question Paper for your classes based on the requested criteria:
        </p>
        <button onClick={handlePrint} style={{ 
          background: '#FFFFFF', 
          color: '#000', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '24px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <Download size={16} /> Download as PDF
        </button>
      </div>

      <div 
        className="print-container"
        ref={printRef}
        style={{ 
          background: '#fff', 
          color: '#000', 
          borderRadius: 'var(--radius-md)', 
          padding: '40px',
          minHeight: '800px',
          boxShadow: 'var(--shadow-md)',
          fontFamily: 'serif' 
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Delhi Public School, Sector-4, Bokaro</h1>
          <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>Subject: _________________</h2>
          <h3 style={{ fontSize: '16px', margin: 0 }}>Class: _________________</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
          <div>Time Allowed: _________________</div>
          <div>Maximum Marks: {assignment.questionSettings?.reduce((acc: number, q: any) => acc + (q.count * q.marks), 0) || '___'}</div>
        </div>

        <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '24px' }}>All questions are compulsory unless stated otherwise.</p>

        {/* Student Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px', fontSize: '15px' }}>
          <div><strong>Name:</strong> _____________________________________</div>
          <div><strong>Roll Number:</strong> _____________________________________</div>
          <div><strong>Class:</strong> _________________ <strong>Section:</strong> _________________</div>
        </div>

        {/* Dynamic Sections from AI */}
        {paper?.sections?.map((section: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '40px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{section.title}</h3>
            {section.instruction && (
              <p style={{ fontStyle: 'italic', marginBottom: '16px', fontSize: '14px' }}>{section.instruction}</p>
            )}
            
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.questions.map((q: any, qIdx: number) => {
                let badgeColor = '#34C759'; // Easy
                if (q.difficulty?.toLowerCase().includes('moderate')) badgeColor = '#FF9500';
                if (q.difficulty?.toLowerCase().includes('challenging') || q.difficulty?.toLowerCase().includes('hard')) badgeColor = '#FF3B30';

                return (
                  <li key={qIdx} style={{ fontSize: '15px', lineHeight: 1.5, position: 'relative', paddingLeft: '8px' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      background: badgeColor, 
                      color: '#fff', 
                      fontSize: '11px', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontWeight: 'bold',
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }}>
                      {q.difficulty || 'Easy'}
                    </span>
                    {q.text}
                    <span style={{ float: 'right', fontWeight: 'bold' }}>[{q.marks} Marks]</span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        
        <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '40px', borderTop: '1px solid #000', paddingTop: '16px' }}>
          End of Question Paper
        </div>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}} />
    </div>
  );
}
