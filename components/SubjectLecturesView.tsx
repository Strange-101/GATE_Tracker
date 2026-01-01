"use client"

import React, { useState } from 'react';
import styles from './Notes.module.css';
import { useApp } from '@/lib/store';
import LecturesModal from './LecturesModal';
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Video,
  Search,
  Trash2
} from 'lucide-react';

const SubjectLecturesView: React.FC = () => {
  const { subjects, selectedSubjectId, selectSubject, addTopic, addSubtopic, toggleSubtopic, deleteSubtopic } = useApp();
  const subject = subjects.find(s => s.id === selectedSubjectId) || null;
  const [activeModal, setActiveModal] = useState<{ topicId: string; subtopicId: string } | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const [newSubtopicFor, setNewSubtopicFor] = useState<{ topicId: string; name: string } | null>(null);

  if (!subject) return <div>Subject not found</div>;

  const handleDeleteSubtopic = (topicId: string, subtopicId: string, subtopicName: string) => {
    if (confirm(`Are you sure you want to delete "${subtopicName}"?`)) {
      deleteSubtopic(subject.id, topicId, subtopicId);
    }
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={() => selectSubject(null, 'lectures')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <h2>{subject.name} (Lectures)</h2>
      </div>

      <div className={styles.actionsRow}>
        <div style={{ display: 'flex', flex: 1, gap: '0.75rem' }}>
          <input 
            className={styles.input}
            style={{ flex: 1 }}
            placeholder="New topic name..." 
            value={newTopic} 
            onChange={e => setNewTopic(e.target.value)} 
          />
          <button 
            className={styles.addBtn}
            onClick={() => { if (newTopic.trim()) { addTopic(subject.id, newTopic.trim()); setNewTopic(''); } }}
          >
            <Plus size={18} />
            Add Topic
          </button>
        </div>
      </div>

      <div className={styles.topicsList}>
        {subject.topics.map(topic => (
          <div key={topic.id} className={styles.topicBlock}>
            <div className={styles.topicHeader}>
              <h3>{topic.name}</h3>
              <button 
                className={styles.backBtn} 
                style={{ padding: '0.4rem 0.75rem' }}
                onClick={() => setNewSubtopicFor({ topicId: topic.id, name: '' })}
              >
                <Plus size={16} />
                Subtopic
              </button>
            </div>

            <div className={styles.subtopicsTable}>
              {topic.subtopics.map(st => {
                const hasLectures = (st.videos && st.videos.length > 0);
                const statusClass = st.completed ? styles.statusGreen : hasLectures ? styles.statusYellow : styles.statusEmpty;
                
                return (
                  <div key={st.id} className={styles.subtopicRow}>
                    <div className={styles.subtopicName}>{st.name}</div>
                    <div className={styles.subtopicStatus}>
                      <div className={`${styles.statusDot} ${statusClass}`} />
                    </div>
                    <div className={styles.subtopicActions}>
                      <button 
                        className={styles.iconBtn}
                        onClick={() => setActiveModal({ topicId: topic.id, subtopicId: st.id })}
                        title="Lectures & Videos"
                      >
                        <Video size={18} />
                      </button>
                      <button 
                        className={styles.iconBtn}
                        style={{ color: st.completed ? 'var(--accent-green)' : 'var(--text-muted)' }}
                        onClick={() => toggleSubtopic(subject.id, topic.id, st.id)}
                        title={st.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteSubtopic(topic.id, st.id, st.name)}
                        title="Delete Subtopic"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {newSubtopicFor && newSubtopicFor.topicId === topic.id && (
              <div className={styles.newSubRow}>
                <input 
                  className={styles.input}
                  style={{ flex: 1 }}
                  placeholder="Subtopic name..." 
                  value={newSubtopicFor.name} 
                  onChange={e => setNewSubtopicFor({ ...newSubtopicFor!, name: e.target.value })} 
                />
                <button 
                  className={styles.addBtn}
                  onClick={() => { if (newSubtopicFor.name.trim()) { addSubtopic(subject.id, topic.id, newSubtopicFor.name.trim()); setNewSubtopicFor(null); } }}
                >
                  Add
                </button>
                <button 
                  className={styles.backBtn}
                  onClick={() => setNewSubtopicFor(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeModal && (
        <LecturesModal
          subjectId={subject.id}
          topicId={activeModal.topicId}
          subtopicId={activeModal.subtopicId}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default SubjectLecturesView;
