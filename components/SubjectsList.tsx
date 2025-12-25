"use client"

import React from 'react';
import styles from './SubjectsList.module.css';
import ProgressBar from './ProgressBar';
import SubjectCard from './SubjectCard';
import { useApp } from '@/lib/store';

const SubjectsList: React.FC = () => {
  const { subjects, overallProgress } = useApp();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2>Subjects</h2>
        <div className={styles.globalBar}><ProgressBar value={overallProgress} labelLeft="Global Progress" /></div>
      </div>

      <div className={styles.grid}>
        {subjects.map(s => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
    </div>
  );
};

export default SubjectsList;
