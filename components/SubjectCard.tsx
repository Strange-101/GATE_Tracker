import React, { useMemo } from 'react';
import styles from './SubjectCard.module.css';
import ProgressBar from './ProgressBar';
import { Subject } from '@/lib/data';
import { useApp } from '@/lib/store';
import { BookOpen, FileText, Video, GraduationCap } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  mode?: 'syllabus' | 'notes' | 'lectures';
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, mode = 'syllabus' }) => {
  const { selectSubject } = useApp();

  const { total, completed, percent } = useMemo(() => {
    let t = 0, c = 0;
    subject.topics.forEach(topic => {
      topic.subtopics.forEach(st => { t++; if (st.completed) c++; });
    });
    const p = t === 0 ? 0 : Math.round((c / t) * 100);
    return { total: t, completed: c, percent: p };
  }, [subject]);

  const Icon = useMemo(() => {
    switch (mode) {
      case 'notes': return FileText;
      case 'lectures': return Video;
      default: return GraduationCap;
    }
  }, [mode]);

  return (
    <div 
      className={styles.card} 
      onClick={() => selectSubject(subject.id, mode)}
      style={{ 
        '--card-accent-color': subject.color,
        '--card-accent-light': `${subject.color}15`
      } as any}
    >
      <div className={styles.titleRow}>
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
        <div className={styles.subjectInfo}>
          <div className={styles.subjectName}>{subject.name}</div>
          <div className={styles.subjectMeta}>
            <span>{subject.topics.length} Topics</span>
            <div className={styles.dot} />
            <span>{total} Subtopics</span>
          </div>
        </div>
      </div>
      
      <div className={styles.progressSection}>
        <ProgressBar 
          value={percent} 
          color={subject.color} 
          labelLeft={mode === 'syllabus' ? 'Syllabus' : mode === 'notes' ? 'Notes' : 'Lectures'} 
          labelRight={`${completed}/${total}`} 
        />
      </div>
    </div>
  );
};

export default SubjectCard;
