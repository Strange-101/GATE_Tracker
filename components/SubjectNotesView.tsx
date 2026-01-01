"use client"

import React, { useState } from 'react';
import styles from './Notes.module.css';
import { useApp } from '@/lib/store';
import NotesModal from './NotesModal';

const SubjectNotesView: React.FC = () => {
  const { subjects, selectedSubjectId, selectSubject, addTopic, addSubtopic, toggleSubtopic } = useApp();
  const subject = subjects.find(s => s.id === selectedSubjectId) || null;
  const [activeModal, setActiveModal] = useState<{ topicId: string; subtopicId: string } | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const [newSubtopicFor, setNewSubtopicFor] = useState<{ topicId: string; name: string } | null>(null);

  if (!subject) return <div>Subject not found</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={() => selectSubject(null, 'notes')}>Back</button>
        <h2>{subject.name} — Notes</h2>
      </div>

      <div className={styles.actionsRow}>
        <input placeholder="New topic name" value={newTopic} onChange={e => setNewTopic(e.target.value)} />
        <button onClick={() => { if (newTopic.trim()) { addTopic(subject.id, newTopic.trim()); setNewTopic(''); } }}>Add Topic</button>
      </div>

      <div className={styles.topicsList}>
        {subject.topics.map(topic => (
          <div key={topic.id} className={styles.topicBlock}>
            <div className={styles.topicHeader}>
              <h3>{topic.name}</h3>
              <div>
                <button onClick={() => setNewSubtopicFor({ topicId: topic.id, name: '' })}>+ Subtopic</button>
              </div>
            </div>

            <div className={styles.subtopicsTable}>
              {topic.subtopics.map(st => {
                const hasNotes = (st.links && st.links.length > 0) || (st.pdfs && st.pdfs.length > 0);
                const status = st.completed ? '🟢' : hasNotes ? '🟡' : '⭕';
                return (
                  <div key={st.id} className={styles.subtopicRow}>
                    <div className={styles.subtopicName}>{st.name}</div>
                    <div className={styles.subtopicStatus}>{status}</div>
                    <div className={styles.subtopicActions}>
                      <button onClick={() => setActiveModal({ topicId: topic.id, subtopicId: st.id })}>Notes</button>
                      <button onClick={() => toggleSubtopic(subject.id, topic.id, st.id)}>{st.completed ? 'Unmark' : 'Complete'}</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {newSubtopicFor && newSubtopicFor.topicId === topic.id && (
              <div className={styles.newSubRow}>
                <input placeholder="Subtopic name" value={newSubtopicFor.name} onChange={e => setNewSubtopicFor({ ...newSubtopicFor!, name: e.target.value })} />
                <button onClick={() => { if (newSubtopicFor.name.trim()) { addSubtopic(subject.id, topic.id, newSubtopicFor.name.trim()); setNewSubtopicFor(null); } }}>Add</button>
                <button onClick={() => setNewSubtopicFor(null)}>Cancel</button>
              </div>
            )}

          </div>
        ))}
      </div>

      {activeModal && (
        <NotesModal
          subjectId={subject.id}
          topicId={activeModal.topicId}
          subtopicId={activeModal.subtopicId}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default SubjectNotesView;
