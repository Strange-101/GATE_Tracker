"use client"

import React from 'react';
import styles from './TopicChecklist.module.css';
import { useApp } from '@/lib/store';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  subjectId: string;
  topic: any;
}

const TopicChecklist: React.FC<Props> = ({ subjectId, topic }) => {
  const { toggleSubtopic } = useApp();

  return (
    <div className={styles.topic}>
      <div className={styles.topicTitle}>{topic.name}</div>
      <ul className={styles.subList}>
        {topic.subtopics.map((st: any) => (
          <li key={st.id} className={styles.subItem} onClick={() => toggleSubtopic(subjectId, topic.id, st.id)}>
            {st.completed ? (
              <CheckCircle2 size={16} className={styles.checked} />
            ) : (
              <Circle size={16} className={styles.unchecked} />
            )}
            <span className={styles.subItemLabel}>{st.name}</span>
            {st.revisionCount > 0 && <span className={styles.revBadge}>R{st.revisionCount}</span>}
            <span className={styles.weight}>{st.weightage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicChecklist;
