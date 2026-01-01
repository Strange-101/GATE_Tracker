"use client"

import React, { useState, useRef, useEffect } from 'react';
import styles from './Notes.module.css';
import { useApp } from '@/lib/store';
import PDFViewer from './PDFViewer';
import { 
  X, 
  Plus, 
  ExternalLink, 
  Eye, 
  Download, 
  Trash2, 
  FileText,
  Link as LinkIcon,
  File as FileIcon
} from 'lucide-react';

interface Props {
  subjectId: string;
  topicId: string;
  subtopicId: string;
  onClose: () => void;
}

const NotesModal: React.FC<Props> = ({ subjectId, topicId, subtopicId, onClose }) => {
  const { subjects, addLink, addPDF, deletePDF, setPdfLastOpened } = useApp();
  const subject = subjects.find(s => s.id === subjectId)!;
  const topic = subject.topics.find(t => t.id === topicId)!;
  const subtopic = topic.subtopics.find(st => st.id === subtopicId)!;

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'Lecture'|'Blog'|'Notes' | string>('Lecture');
  const [viewPdfId, setViewPdfId] = useState<string | null>(null);
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleAddLink = () => {
    if (!title.trim() || !url.trim()) return;
    addLink(subjectId, topicId, subtopicId, { id: `${Date.now()}`, title: title.trim(), url: url.trim(), type });
    setTitle(''); setUrl('');
  };

  const handleFile = async (f?: File) => {
    const file = f || (fileRef.current && fileRef.current.files && fileRef.current.files[0]);
    if (!file) return;
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      alert('PDF too large. Please upload files smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addPDF(subjectId, topicId, subtopicId, { id: `${Date.now()}`, name: file.name, dataUrl, lastOpenedPage: 1 });
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePDF = (pdfId: string) => {
    const ok = confirm('Delete this PDF? This action cannot be undone.');
    if (!ok) return;
    if (viewPdfId === pdfId && viewPdfUrl) {
      try { URL.revokeObjectURL(viewPdfUrl); } catch(e) {}
      setViewPdfId(null);
      setViewPdfUrl(null);
    }
    deletePDF(subjectId, topicId, subtopicId, pdfId);
  };

  useEffect(() => {
    return () => {
      if (viewPdfUrl) {
        try { URL.revokeObjectURL(viewPdfUrl); } catch(e) {}
      }
    };
  }, [viewPdfUrl]);

  const handlePageChange = React.useCallback((page: number) => {
    if (viewPdfId) {
      setPdfLastOpened(subjectId, topicId, subtopicId, viewPdfId, page);
    }
  }, [subjectId, topicId, subtopicId, viewPdfId, setPdfLastOpened]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3>{subject.name} • {topic.name} • {subtopic.name}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.section}>
            <h4>Links</h4>
            <div className={styles.formRow}>
              <input 
                className={styles.input}
                placeholder="Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
              <input 
                className={styles.input}
                placeholder="https://..." 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
              />
              <select 
                className={styles.select}
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option>Lecture</option>
                <option>Blog</option>
                <option>Notes</option>
              </select>
              <button className={styles.addBtn} onClick={handleAddLink}>
                <Plus size={18} />
                Add
              </button>
            </div>

            <div className={styles.linkList}>
              {(subtopic.links || []).map(l => (
                <div key={l.id} className={styles.linkCard}>
                  <div className={styles.cardTitle}>{l.title}</div>
                  <div className={styles.cardMeta}>
                    <span className={styles.tag}>{l.type}</span>
                    <a href={l.url} target="_blank" rel="noreferrer" className={styles.iconBtn}>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h4>PDFs</h4>
            <div className={styles.formRow} style={{ gridTemplateColumns: '1fr auto' }}>
              <input 
                ref={fileRef} 
                type="file" 
                accept="application/pdf" 
                className={styles.input}
                onChange={() => handleFile()}
              />
              <button className={styles.addBtn} onClick={() => fileRef.current?.click()}>
                <Plus size={18} />
                Upload PDF
              </button>
            </div>

            <div className={styles.pdfList}>
              {(subtopic.pdfs || []).map(p => (
                <div key={p.id} className={styles.pdfCard}>
                  <div className={styles.cardTitle}>{p.name}</div>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.iconBtn}
                      onClick={async () => {
                        try {
                          const blob = await (await fetch(p.dataUrl!)).blob();
                          const url = URL.createObjectURL(blob);
                          setViewPdfId(p.id);
                          setViewPdfUrl(url);
                        } catch (e) {
                          console.error('Failed to prepare PDF for viewing', e);
                          alert('Unable to open PDF');
                        }
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <a href={p.dataUrl} download={p.name} className={styles.iconBtn}>
                      <Download size={16} />
                    </a>
                    <button 
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeletePDF(p.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {viewPdfUrl && viewPdfId && (
            <div className={styles.pdfViewerWrap}>
              <PDFViewer
                dataUrl={viewPdfUrl}
                onClose={() => {
                  try { URL.revokeObjectURL(viewPdfUrl); } catch(e) {}
                  setViewPdfUrl(null);
                  setViewPdfId(null);
                }}
                onPageChange={handlePageChange}
                initialPage={(subtopic.pdfs || []).find(pp => pp.id === viewPdfId)!.lastOpenedPage || 1}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NotesModal;
