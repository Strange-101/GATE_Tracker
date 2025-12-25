"use client"

import React, { useMemo } from 'react';
import styles from './SubjectCard.module.css';
import ProgressBar from './ProgressBar';
import { Subject } from '@/lib/data';
import { useApp } from '@/lib/store';

const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { selectSubject } = useApp();

  const { total, completed, percent } = useMemo(() => {
    let t = 0, c = 0;
    subject.topics.forEach(topic => {
      topic.subtopics.forEach(st => { t++; if (st.completed) c++; });
    });
    const p = t === 0 ? 0 : Math.round((c / t) * 100);
    return { total: t, completed: c, percent: p };
  }, [subject]);

  return (
    <div className={styles.card} onClick={() => selectSubject(subject.id)}>
      <div className={styles.titleRow}>
        <div className={styles.subjectName}>{subject.name}</div>
      </div>
      <ProgressBar value={percent} color={subject.color} labelLeft="Progress" labelRight={`${completed}/${total}`} />
    </div>
  );
};

export default SubjectCard;
