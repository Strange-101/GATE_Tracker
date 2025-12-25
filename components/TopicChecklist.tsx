"use client"

import React from 'react';
import styles from './TopicChecklist.module.css';
import sidebarStyles from './RightSidebar.module.css';
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
          <li key={st.id} className={sidebarStyles.topicItem} onClick={() => toggleSubtopic(subjectId, topic.id, st.id)}>
            {st.completed ? (
              <CheckCircle2 size={16} className={sidebarStyles.checked} />
            ) : (
              <Circle size={16} className={sidebarStyles.unchecked} />
            )}
            <span className={sidebarStyles.topicName}>{st.name}</span>
            {st.revisionCount > 0 && <span className={sidebarStyles.revBadge}>R{st.revisionCount}</span>}
            <span className={sidebarStyles.weight}>{st.weightage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicChecklist;
