"use client"

import React from 'react';
import styles from './SubjectsList.module.css';
import { useApp } from '@/lib/store';

const NotesView: React.FC = () => {
  const { subjects, selectSubject } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2>Notes</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Select a subject to view or add notes</p>
        </div>
      </div>

      <div className={styles.grid}>
        {subjects.map(s => (
          <button key={s.id} onClick={() => selectSubject(s.id, 'notes')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', textAlign: 'left' }}>
            <div style={{ width: 10, height: 48, borderRadius: 6, background: s.color }} />
            <div>
              <h4 style={{ margin: 0 }}>{s.name}</h4>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.topics.length} topics</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotesView;
