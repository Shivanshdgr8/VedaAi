'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setAssignments, setLoading } from '../store/assignmentSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { assignments, loading } = useSelector((state: RootState) => state.assignments);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    dispatch(setLoading(true));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/assignments`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        dispatch(setAssignments(data.assignments));
      } else {
        // Fallback mock data purely for visual matching if backend is down
        dispatch(setAssignments([
          { _id: '1', title: 'Quiz on Electricity', dueDate: '21-06-2025', status: 'completed', questionSettings: [], createdAt: '2025-06-20T00:00:00.000Z' },
          { _id: '2', title: 'Quiz on Electricity', dueDate: '21-06-2025', status: 'completed', questionSettings: [], createdAt: '2025-06-20T00:00:00.000Z' },
        ]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = assignments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34C759' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Assignments</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Manage and create assignments for your classes.</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
          <Filter size={18} /> Filter By
        </button>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search Assignment..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '40px', border: '1px solid var(--border-color)', outline: 'none', background: '#F9F9FB' }}
          />
        </div>
      </div>

      {assignments.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            {/* Simple CSS Illustration matching empty state */}
            <div style={{ width: '120px', height: '140px', background: '#F2F2F7', borderRadius: '8px', border: '2px solid #E5E5EA', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', left: '20px', right: '20px', height: '8px', background: '#D1D1D6', borderRadius: '4px' }} />
              <div style={{ position: 'absolute', top: '44px', left: '20px', right: '40px', height: '8px', background: '#D1D1D6', borderRadius: '4px' }} />
              <div style={{ position: 'absolute', top: '64px', left: '20px', right: '20px', height: '8px', background: '#D1D1D6', borderRadius: '4px' }} />
              
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: '#fff', border: '4px solid #FF5A36', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#FF5A36', fontSize: '32px', fontWeight: 'bold' }}>&#10006;</div>
                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '30px', height: '8px', background: '#D1D1D6', transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No assignments yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '24px', lineHeight: 1.5 }}>
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 32px' }}>
              <Plus size={18} /> Create Your First Assignment
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', paddingBottom: '80px', overflowY: 'auto' }}>
          {filtered.map(assignment => (
            <div key={assignment._id} style={{ 
              background: '#fff', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{assignment.title}</h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <MoreVertical size={20} />
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600, color: '#000' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Assigned on :</span> {new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Due :</span> {assignment.dueDate.replace(/\//g, '-')}</div>
              </div>
              
              <Link href={`/assignments/${assignment._id}`} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
            </div>
          ))}
        </div>
      )}
      
      {assignments.length > 0 && (
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <Link href="/assignments/create" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 32px', boxShadow: 'var(--shadow-md)' }}>
              <Plus size={18} /> Create Assignment
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
