"use client"

import React from 'react';
import styles from './SubjectsList.module.css';
import { useApp } from '@/lib/store';
import SubjectCard from './SubjectCard';

const LecturesView: React.FC = () => {
  const { subjects } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Lectures & Videos</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Manage your video lectures and resources</p>
        </div>
      </div>

      <div className={styles.grid}>
        {subjects.map(s => (
          <SubjectCard key={s.id} subject={s} mode="lectures" />
        ))}
      </div>
    </div>
  );
};

export default LecturesView;
