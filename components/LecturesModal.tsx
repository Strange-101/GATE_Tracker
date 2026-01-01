"use client"

import React, { useState, useRef } from 'react';
import styles from './Notes.module.css';
import { useApp } from '@/lib/store';
import { 
  X, 
  Plus, 
  ExternalLink, 
  Play, 
  Trash2, 
  Video,
  Link as LinkIcon
} from 'lucide-react';

interface Props {
  subjectId: string;
  topicId: string;
  subtopicId: string;
  onClose: () => void;
}

const LecturesModal: React.FC<Props> = ({ subjectId, topicId, subtopicId, onClose }) => {
  const { subjects, addVideo, deleteVideo } = useApp();
  const subject = subjects.find(s => s.id === subjectId)!;
  const topic = subject.topics.find(t => t.id === topicId)!;
  const subtopic = topic.subtopics.find(st => st.id === subtopicId)!;

  const [videoName, setVideoName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddVideoLink = () => {
    if (!videoName.trim() || !videoUrl.trim()) return;
    addVideo(subjectId, topicId, subtopicId, { 
      id: `${Date.now()}`, 
      name: videoName.trim(), 
      url: videoUrl.trim(), 
      type: 'Link' 
    });
    setVideoName(''); 
    setVideoUrl('');
  };

  const handleDeleteVideo = (videoId: string) => {
    const ok = confirm('Delete this video? This action cannot be undone.');
    if (!ok) return;
    deleteVideo(subjectId, topicId, subtopicId, videoId);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3>{subject.name} • {topic.name} • {subtopic.name} (Lectures)</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.section}>
            <h4>Add Video Lecture</h4>
            <div className={styles.formRow}>
              <input 
                className={styles.input}
                placeholder="Video Title (e.g., L1: Introduction)" 
                value={videoName} 
                onChange={e => setVideoName(e.target.value)} 
              />
              <input 
                className={styles.input}
                placeholder="YouTube / Video URL" 
                value={videoUrl} 
                onChange={e => setVideoUrl(e.target.value)} 
              />
              <button className={styles.addBtn} onClick={handleAddVideoLink}>
                <Plus size={18} />
                Add
              </button>
            </div>

            <div className={styles.linkList}>
              {(subtopic.videos || []).map(v => (
                <div key={v.id} className={styles.linkCard}>
                  <div className={styles.cardTitle}>
                    <Video size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    {v.name}
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.tag}>{v.type}</span>
                    <a href={v.url} target="_blank" rel="noreferrer" className={styles.iconBtn}>
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteVideo(v.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Optional: Add file upload if needed, but links are usually preferred for videos */}
          <section className={styles.section}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tip: You can add links to YouTube, Google Drive, or any other video hosting platform.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LecturesModal;
