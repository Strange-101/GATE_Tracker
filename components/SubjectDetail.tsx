"use client"

import React, { useMemo } from 'react';
import styles from './SubjectDetail.module.css';
import { useApp } from '@/lib/store';
import ProgressBar from './ProgressBar';
import TopicChecklist from './TopicChecklist';

const SubjectDetail: React.FC = () => {
  const { subjects, selectedSubjectId, selectSubject } = useApp();
  const subject = subjects.find(s => s.id === selectedSubjectId);

  const { total, completed, percent } = useMemo(() => {
    if (!subject) return { total: 0, completed: 0, percent: 0 };
    let t = 0, c = 0;
    subject.topics.forEach(topic => {
      topic.subtopics.forEach(st => { t++; if (st.completed) c++; });
    });
    return { total: t, completed: c, percent: t === 0 ? 0 : Math.round((c / t) * 100) };
  }, [subject]);

  if (!subject) return <div className={styles.container}><p>Select a subject</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{subject.name}</div>
          <div style={{color: 'var(--text-muted)', fontSize:12}}>{completed}/{total} topics completed</div>
        </div>
        <div>
          <button onClick={() => selectSubject(null)}>Back</button>
        </div>
      </div>

      <ProgressBar value={percent} color={subject.color} labelLeft="Subject Progress" />

      <div className={styles.topics}>
        {subject.topics.map(topic => (
          <TopicChecklist key={topic.id} subjectId={subject.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default SubjectDetail;
