"use client"

import React, { useState, useRef, useEffect } from 'react';
import styles from './Notes.module.css';
import { useApp } from '@/lib/store';
import PDFViewer from './PDFViewer';

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
    // Limit PDF size to avoid blowing up localStorage
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
    // if we are viewing this pdf, revoke its object URL
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

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3>{subject.name} • {topic.name} • {subtopic.name}</h3>
          <button onClick={onClose}>Close</button>
        </div>

        <div className={styles.modalBody}>
          <section>
            <h4>Links</h4>
            <div className={styles.formRow}>
              <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <input placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
              <select value={type} onChange={e => setType(e.target.value)}>
                <option>Lecture</option>
                <option>Blog</option>
                <option>Notes</option>
              </select>
              <button onClick={handleAddLink}>Add Link</button>
            </div>

            <ul className={styles.linkList}>
              {(subtopic.links || []).map(l => (
                <li key={l.id}><a href={l.url} target="_blank" rel="noreferrer">{l.title}</a> <span>({l.type})</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h4>PDFs</h4>
            <div className={styles.formRow}>
              <input ref={fileRef} type="file" accept="application/pdf" />
              <button onClick={() => handleFile()}>Upload PDF</button>
            </div>

            <ul className={styles.pdfList}>
              {(subtopic.pdfs || []).map(p => (
                <li key={p.id} className={styles.pdfRow}>
                  <span>{p.name}</span>
                  <div>
                    <button onClick={async () => {
                      // create object URL from dataUrl for reliable iframe rendering
                      try {
                        const blob = await (await fetch(p.dataUrl!)).blob();
                        const url = URL.createObjectURL(blob);
                        setViewPdfId(p.id);
                        setViewPdfUrl(url);
                      } catch (e) {
                        console.error('Failed to prepare PDF for viewing', e);
                        alert('Unable to open PDF');
                      }
                    }}>View</button>
                    <a href={p.dataUrl} download={p.name}><button>Download</button></a>
                    <button onClick={() => handleDeletePDF(p.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
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
                onPageChange={(page) => setPdfLastOpened(subjectId, topicId, subtopicId, viewPdfId, page)}
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
