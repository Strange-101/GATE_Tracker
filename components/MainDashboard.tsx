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
import ConsistencyTrackingView from './ConsistencyTrackingView';
import TasksView from './TasksView';

// Static data removed for dynamic generation

const MainDashboard = () => {
  const { subjects, tasks, overallProgress, view, setView, selectSubject, studyLogs, taskSortBy } = useApp();
  
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

  // Generate chart data based on study logs
  const chartData = React.useMemo(() => {
    // Generate last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const timeline = days.map(day => {
      const dataPoint: any = { name: new Date(day).toLocaleDateString('en-IN', { weekday: 'short' }) };
      
      subjects.forEach(s => {
        // Find logs for this subject on or before this day
        // (Cumulative display makes it look like progress)
        const count = studyLogs.filter(log => {
          const logDay = log.date.split('T')[0];
          return log.subjectId === s.id && logDay <= day;
        }).length;
        
        dataPoint[s.id] = count;
      });
      
      return dataPoint;
    });

    return timeline;
  }, [studyLogs, subjects]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr === 'Today' || dateStr === 'Tomorrow' || isNaN(Date.parse(dateStr))) return dateStr;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateClone = new Date(date);
    dateClone.setHours(0, 0, 0, 0);
    if (dateClone.getTime() === today.getTime()) return 'Today';
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (dateClone.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

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

  if (view === 'tracking') {
    return <main className={styles.main}><ConsistencyTrackingView /></main>;
  }

  if (view === 'tasks') {
    return <main className={styles.main}><TasksView /></main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.chartSection}>
        {/* ... existing chart code ... */}
        <div className={styles.chartHeader}>
          <h3>Topic Progress Timeline</h3>
          <div className={styles.chartLegend}>
            {subjects
              .filter(s => studyLogs.some(log => log.subjectId === s.id))
              .map(s => (
                <span key={s.id} className={styles.dot} style={{ '--dot-color': s.color } as any}>{s.name}</span>
              ))}
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
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
            {studyLogs.length > 0 ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {subjects.map(s => {
                  const subjectLogs = studyLogs.filter(log => log.subjectId === s.id);
                  const count = subjectLogs.length;
                  const maxLogs = Math.max(...subjects.map(sub => studyLogs.filter(l => l.subjectId === sub.id).length), 1);
                  const percent = (count / maxLogs) * 100;

                  return (
                    <div key={s.id} className={styles.statRow} style={{ opacity: count > 0 ? 1 : 0.5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', width: '100%' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count} sessions</span>
                      </div>
                      <div className={styles.miniProgress}>
                        <div 
                          className={styles.fill} 
                          style={{ 
                            width: `${Math.max(percent, 2)}%`, 
                            background: s.color,
                            boxShadow: `0 0 8px ${s.color}44`
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <div className={styles.circularStat}>
                  <div className={styles.statInfo}>
                    <span className={styles.statValue}>{overallProgress}%</span>
                    <span className={styles.statLabel}>Engaged</span>
                  </div>
                </div>
                <div className={styles.statBars}>
                  {subjects.slice(0, 4).map(s => (
                    <div key={s.id} className={styles.statRow}>
                      <span>{s.id.toUpperCase()}</span>
                      <div className={styles.miniProgress}><div className={styles.fill} style={{width: '60%', background: s.color}}></div></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.lecturePanel}>
          <div className={styles.panelHeader}>
             <h3>Pending Tasks</h3>
             <button 
               onClick={() => setView('tasks')}
               style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer' }}
             >
               View All
             </button>
          </div>
          <div className={styles.lectureList}>
             {tasks.filter(t => !t.completed).length > 0 ? (
               tasks.filter(t => !t.completed)
                 .sort((a, b) => {
                   const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
                   
                   if (taskSortBy === 'Priority') {
                     const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
                     const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
                     if (weightA !== weightB) return weightB - weightA;
                   }

                   const parseDate = (d: string) => {
                     if (!d) return Infinity;
                     if (d === 'Today') return new Date().setHours(0,0,0,0);
                     if (d === 'Tomorrow') return new Date().setHours(0,0,0,0) + 86400000;
                     const p = Date.parse(d);
                     return isNaN(p) ? Infinity : p;
                   };

                   const dateA = parseDate(a.dueDate);
                   const dateB = parseDate(b.dueDate);
                   return dateA - dateB;
                 })
                 .slice(0, 5).map(task => (
                  <div 
                    key={task.id} 
                    className={styles.taskMini}
                    style={{ cursor: 'pointer', borderLeft: `3px solid ${subjects.find(s => s.id === task.subject)?.color || 'var(--border-color)'}` }}
                    onClick={() => setView('tasks')}
                  >
                     <div className={styles.taskMiniTitle}>{task.title}</div>
                     <div className={styles.taskMiniMeta}>
                       {subjects.find(s => s.id === task.subject)?.name || task.subject} • {formatDate(task.dueDate)}
                     </div>
                  </div>
               ))
             ) : (
               <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                 All tasks completed! 🎉
               </div>
             )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;
