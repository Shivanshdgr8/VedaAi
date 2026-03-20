'use client';

import React, { useState } from 'react';
import { UploadCloud, Plus, X, ArrowLeft, ArrowRight, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateAssignment() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [questions, setQuestions] = useState([
    { id: '1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
    { id: '2', type: 'Short Questions', count: 3, marks: 2 },
    { id: '3', type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
  ]);

  const addQuestionType = () => {
    setQuestions([...questions, { id: Math.random().toString(), type: 'Generic Questions', count: 1, marks: 1 }]);
  };

  const removeQuestionType = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const totalQuestions = questions.reduce((sum, q) => sum + q.count, 0);
  const totalMarks = questions.reduce((sum, q) => sum + (q.count * q.marks), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate || questions.length === 0) return alert('Please fill in required fields');

    const formData = new FormData();
    formData.append('title', 'New Gen Assignment');
    formData.append('dueDate', dueDate);
    formData.append('questionSettings', JSON.stringify(questions));
    formData.append('additionalInstructions', additionalInfo);
    if (file) formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/assignments`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/assignments/${data.assignment._id}`);
      }
    } catch (err) {
      console.error(err);
      // For fallback/mock
      router.push(`/assignments/mock-1234`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '800px', width: '100%', background: '#fff', padding: '32px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Assignment Details</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Basic information about your assignment</p>
        
        {/* Upload Box */}
        <div style={{ 
          border: '2px dashed var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          padding: '40px 20px', 
          textAlign: 'center',
          backgroundColor: '#F9F9FB',
          marginBottom: '16px',
          cursor: 'pointer'
        }}>
          <UploadCloud size={32} color="var(--text-main)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Choose a file or drag & drop it here</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>JPEG, PNG, upto 10MB</p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button className="btn-secondary" style={{ padding: '8px 24px', fontSize: '13px' }}>Browse Files</button>
            <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Due Date</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: '#F9F9FB', fontSize: '14px' }} 
            />
          </div>
        </div>

        {/* Question Types */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <label style={{ fontSize: '14px', fontWeight: 600, margin: 0, width: '40%' }}>Question Type</label>
             <div style={{ display: 'flex', width: '60%', justifyContent: 'flex-start', gap: '32px' }}>
               <label style={{ fontSize: '14px', fontWeight: 600, margin: 0, flex: 1, textAlign: 'center' }}>No. of Questions</label>
               <label style={{ fontSize: '14px', fontWeight: 600, margin: 0, flex: 1, textAlign: 'center' }}>Marks</label>
               <div style={{ width: '20px' }} />
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questions.map((q) => (
              <div key={q.id} style={{ display: 'flex', gap: '24px', alignItems: 'center', background: '#F9F9FB', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                <select 
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                  style={{ width: '40%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: '#fff', fontWeight: 500 }}
                >
                  <option>Multiple Choice Questions</option>
                  <option>Short Questions</option>
                  <option>Diagram/Graph-Based Questions</option>
                  <option>Numerical Problems</option>
                  <option>Generic Questions</option>
                </select>
                
                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuestion(q.id, 'count', Math.max(1, q.count - 1))} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#E5E5EA', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                  <div style={{ width: '30px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px' }}>{q.count}</div>
                  <button onClick={() => updateQuestion(q.id, 'count', q.count + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#E5E5EA', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                </div>

                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQuestion(q.id, 'marks', Math.max(1, q.marks - 1))} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#E5E5EA', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                  <div style={{ width: '30px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px' }}>{q.marks}</div>
                  <button onClick={() => updateQuestion(q.id, 'marks', q.marks + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: '#E5E5EA', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                </div>

                <button onClick={() => removeQuestionType(q.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <button onClick={addQuestionType} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
            <div style={{ background: 'var(--text-main)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></div>
            Add Question Type
          </button>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>Total Questions : {totalQuestions}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>Total Marks : {totalMarks}</div>
        </div>

        {/* Additional Information */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Additional Information (For better output)</label>
          <div style={{ position: 'relative' }}>
            <textarea 
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: '#F9F9FB', minHeight: '120px', fontSize: '14px', resize: 'vertical' }}
            />
            <Mic size={20} color="var(--text-muted)" style={{ position: 'absolute', bottom: '16px', right: '16px', cursor: 'pointer' }} />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => router.back()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Previous
          </button>
          <button onClick={handleSubmit} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
