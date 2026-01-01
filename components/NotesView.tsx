"use client"

import React from 'react';
import styles from './SubjectsList.module.css';
import { useApp } from '@/lib/store';
import { BookOpen, ChevronRight } from 'lucide-react';

const NotesView: React.FC = () => {
  const { subjects, selectSubject } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Notes & Resources</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Select a subject to manage your study materials</p>
        </div>
      </div>

      <div className={styles.grid}>
        {subjects.map(s => (
          <button 
            key={s.id} 
            onClick={() => selectSubject(s.id, 'notes')} 
            className={styles.card}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1.25rem',
              textAlign: 'left',
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `${s.color}15`,
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{s.name}</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {s.topics.length} Topics • {s.topics.reduce((acc, t) => acc + t.subtopics.length, 0)} Subtopics
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>
        ))}
      </div>
    </div>
  );
};


export default NotesView;

