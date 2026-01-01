"use client"

import React, { useState, useEffect } from 'react';
import styles from './MainDashboard.module.css';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FileText, Video, Clock } from 'lucide-react';

import { useApp } from '@/lib/store';
import NotesEditor from './NotesEditor';
import SubjectsList from './SubjectsList';
import SubjectDetail from './SubjectDetail';
import NotesView from './NotesView';
import SubjectNotesView from './SubjectNotesView';
import LecturesView from './LecturesView';
import SubjectLecturesView from './SubjectLecturesView';

const data = [
  { name: 'Week 1', ds: 20, os: 10, cn: 5, coa: 0, toc: 0, cd: 0 },
  { name: 'Week 2', ds: 35, os: 20, cn: 15, coa: 5, toc: 0, cd: 0 },
  { name: 'Week 3', ds: 50, os: 35, cn: 25, coa: 15, toc: 5, cd: 0 },
  { name: 'Week 4', ds: 60, os: 45, cn: 35, coa: 25, toc: 15, cd: 5 },
  { name: 'Week 5', ds: 75, os: 55, cn: 45, coa: 35, toc: 25, cd: 15 },
  { name: 'Week 6', ds: 85, os: 65, cn: 55, coa: 45, toc: 35, cd: 25 },
];

const MainDashboard = () => {
  const { subjects, tasks, overallProgress, view, selectSubject } = useApp();
  
  // Aggregate all notes (links) and PDFs from all subjects/topics/subtopics
  const allResources = React.useMemo(() => {
    const resources: { 
      id: string; 
      name: string; 
      type: 'Link' | 'PDF' | 'Video'; 
      parentSubject: string; 
      parentSubtopic: string;
      subjectId: string;
      url?: string;
    }[] = [];

    subjects.forEach(s => {
      s.topics.forEach(t => {
        t.subtopics.forEach(st => {
          // Add links
          (st.links || []).forEach(l => {
            resources.push({
              id: l.id,
              name: l.title,
              type: 'Link',
              parentSubject: s.name,
              parentSubtopic: st.name,
              subjectId: s.id,
              url: l.url
            });
          });
          // Add PDFs
          (st.pdfs || []).forEach(p => {
            resources.push({
              id: p.id,
              name: p.name,
              type: 'PDF',
              parentSubject: s.name,
              parentSubtopic: st.name,
              subjectId: s.id
            });
          });
          // Add Videos
          (st.videos || []).forEach(v => {
            resources.push({
              id: v.id,
              name: v.name,
              type: 'Video',
              parentSubject: s.name,
              parentSubtopic: st.name,
              subjectId: s.id,
              url: v.url
            });
          });
        });
      });
    });
    return resources.sort((a, b) => Number(b.id) - Number(a.id)); // Newest first (assuming ID is timestamp)
  }, [subjects]);

  if (view === 'subjects') {
    return <main className={styles.main}><SubjectsList /></main>;
  }

  if (view === 'subjectDetail') {
    return <main className={styles.main}><SubjectDetail /></main>;
  }

  if (view === 'notes') {
    return <main className={styles.main}><NotesView /></main>;
  }

  if (view === 'notesSubject') {
    return <main className={styles.main}><SubjectNotesView /></main>;
  }

  if (view === 'lectures') {
    return <main className={styles.main}><LecturesView /></main>;
  }

  if (view === 'lecturesSubject') {
    return <main className={styles.main}><SubjectLecturesView /></main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.chartSection}>
        {/* ... existing chart code ... */}
        <div className={styles.chartHeader}>
          <h3>Topic Progress Timeline</h3>
          <div className={styles.chartLegend}>
            {subjects.map(s => (
              <span key={s.id} className={styles.dot} style={{ '--dot-color': s.color } as any}>{s.name}</span>
            ))}
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                {subjects.map(s => (
                  <linearGradient key={s.id} id={`color${s.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              {subjects.map(s => (
                <Area key={s.id} type="monotone" dataKey={s.id} stroke={s.color} fillOpacity={1} fill={`url(#color${s.id})`} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.notesPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <FileText size={18} />
              <h3>Added Resources</h3>
            </div>
          </div>
          <div className={styles.resourceList}>
            {allResources.length > 0 ? (
              allResources.slice(0, 10).map(res => (
                <div 
                  key={res.id} 
                  className={styles.noteCard}
                  onClick={() => selectSubject(res.subjectId, 'notes')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4>{res.name}</h4>
                    <span className={styles.resType}>{res.type}</span>
                  </div>
                  <p>{res.parentSubject} • {res.parentSubtopic}</p>
                  {res.type === 'Link' && (
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open Link
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No resources added yet. Go to Subjects or Notes to add links and PDFs.
              </div>
            )}
          </div>
        </div>

        <div className={styles.engagementPanel}>
          <div className={styles.panelHeader}>
             <h3>Consistency Tracking</h3>
          </div>
          <div className={styles.engagementContent}>
            <div className={styles.circularStat}>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{overallProgress}%</span>
                <span className={styles.statLabel}>Engaged</span>
              </div>
            </div>
            <div className={styles.statBars}>
              {subjects.map(s => (
                <div key={s.id} className={styles.statRow}>
                  <span>{s.id.toUpperCase()}</span>
                  <div className={styles.miniProgress}><div className={styles.fill} style={{width: '60%', background: s.color}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.lecturePanel}>
          <div className={styles.panelHeader}>
             <h3>Pending Tasks</h3>
          </div>
          <div className={styles.lectureList}>
             {tasks.slice(0, 3).map(task => (
                <div key={task.id} className={styles.taskMini}>
                   <div className={styles.taskMiniTitle}>{task.title}</div>
                   <div className={styles.taskMiniMeta}>{task.subject} • {task.dueDate}</div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
