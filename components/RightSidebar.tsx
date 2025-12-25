"use client"

import React from 'react';
import styles from './RightSidebar.module.css';
import { useApp } from '@/lib/store';
import { ChevronDown, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

const RightSidebar = () => {
  const { subjects, tasks, toggleSubtopic, overallProgress } = useApp();

  return (
    <aside className={styles.rightSidebar}>
      <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Topic Checklist</h3>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div className={styles.count}>{overallProgress}%</div>
              <div style={{width:120}}><ProgressBar value={overallProgress} /></div>
            </div>
          </div>
        
        <div className={styles.syllabusList}>
          {subjects.map((subject: any) => (
            <div key={subject.id} className={styles.subjectGroup}>
              <div className={styles.subjectHeader}>
                <ChevronDown size={14} />
                <span>{subject.name}</span>
                <span style={{marginLeft:'auto', fontSize:12, color:'var(--text-muted)'}}>
                  {(() => {
                    let t=0,c=0; subject.topics.forEach((topic:any)=> topic.subtopics.forEach((st:any)=>{t++; if(st.completed) c++}))
                    return `${c}/${t}`;
                  })()}
                </span>
              </div>
              <div className={styles.topics}>
                {subject.topics.map((topic: any) => (
                  <div key={topic.id} className={styles.topicGroup}>
                    {topic.subtopics.map((subtopic: any) => (
                      <div 
                        key={subtopic.id} 
                        className={styles.topicItem}
                        onClick={() => toggleSubtopic(subject.id, topic.id, subtopic.id)}
                      >
                        {subtopic.completed ? (
                          <CheckCircle2 size={16} className={styles.checked} />
                        ) : (
                          <Circle size={16} className={styles.unchecked} />
                        )}
                        <span className={styles.topicName}>{subtopic.name}</span>
                        {subtopic.revisionCount > 0 && (
                          <span className={styles.revBadge}>R{subtopic.revisionCount}</span>
                        )}
                        <span className={styles.weight}>{subtopic.weightage}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Upcoming Tasks</h3>
        </div>
        
        <div className={styles.tasksContainer}>
          <div className={styles.donutPlaceholder}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className={styles.donutBg} />
              <circle cx="50" cy="50" r="40" className={styles.donutFg} />
            </svg>
            <div className={styles.donutText}>
              <span className={styles.taskCount}>34</span>
              <span className={styles.taskLabel}>Tasks</span>
            </div>
          </div>

          <div className={styles.taskList}>
            <div className={styles.taskItem}>
              <AlertCircle size={16} className={styles.priorityHigh} />
              <div className={styles.taskInfo}>
                <p>Revise Deadlocks</p>
                <span>OS • Today</span>
              </div>
            </div>
            <div className={styles.taskItem}>
              <Circle size={16} className={styles.priorityMed} />
              <div className={styles.taskInfo}>
                <p>Solve Array PYQs</p>
                <span>DS • Tomorrow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
