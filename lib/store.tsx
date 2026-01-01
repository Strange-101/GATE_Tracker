"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, SYLLABUS, MOCK_TASKS, Link, PDFFile, VideoFile, StudyLog } from './data';

interface AppContextType {
  subjects: Subject[];
  tasks: any[];
  overallProgress: number;
  studyTime: number; // in seconds
  addStudyTime: (seconds: number) => void;
  toggleSubtopic: (subjectId: string, topicId: string, subtopicId: string) => void;
  // navigation state
  view: 'dashboard' | 'subjects' | 'subjectDetail' | 'notes' | 'notesSubject' | 'lectures' | 'lecturesSubject' | 'tracking';
  setView: (v: 'dashboard' | 'subjects' | 'subjectDetail' | 'notes' | 'notesSubject' | 'lectures' | 'lecturesSubject' | 'tracking') => void;
  selectedSubjectId?: string | null;
  selectSubject: (id: string | null, mode?: 'syllabus' | 'notes' | 'lectures') => void;
  // notes/topic modification
  addTopic: (subjectId: string, topicName: string) => void;
  addSubtopic: (subjectId: string, topicId: string, subtopicName: string) => void;
  addLink: (subjectId: string, topicId: string, subtopicId: string, link: Link) => void;
  addPDF: (subjectId: string, topicId: string, subtopicId: string, pdf: PDFFile) => void;
  deletePDF: (subjectId: string, topicId: string, subtopicId: string, pdfId: string) => void;
  setPdfLastOpened: (subjectId: string, topicId: string, subtopicId: string, pdfId: string, page: number) => void;
  addVideo: (subjectId: string, topicId: string, subtopicId: string, video: VideoFile) => void;
  deleteVideo: (subjectId: string, topicId: string, subtopicId: string, videoId: string) => void;
  deleteSubtopic: (subjectId: string, topicId: string, subtopicId: string) => void;
  studyLogs: StudyLog[];
  addStudyLog: (log: Omit<StudyLog, 'id' | 'date'> & { date?: string }) => void;
  deleteStudyLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(SYLLABUS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const calculateProgress = (currentSubjects: Subject[]) => {
    let total = 0;
    let completed = 0;
    currentSubjects.forEach(s => {
      s.topics.forEach(t => {
        t.subtopics.forEach(st => {
          total++;
          if (st.completed) completed++;
        });
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const [overallProgress, setOverallProgress] = useState<number>(() => calculateProgress(SYLLABUS));
  const [studyTime, setStudyTime] = useState(0);
  const [view, setView] = useState<'dashboard' | 'subjects' | 'subjectDetail' | 'notes' | 'notesSubject' | 'lectures' | 'lecturesSubject' | 'tracking'>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  // load persisted subjects (notes + user added content)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('app_subjects_v1');
      if (raw) {
        const parsed = JSON.parse(raw) as Subject[];
        // merge with default syllabus to ensure any missing fields exist
        setSubjects(parsed);
        setOverallProgress(calculateProgress(parsed));
      }

      const rawLogs = localStorage.getItem('app_study_logs_v1');
      if (rawLogs) {
        setStudyLogs(JSON.parse(rawLogs));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // persist subjects whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app_subjects_v1', JSON.stringify(subjects));
    } catch (e) {}
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('app_study_logs_v1', JSON.stringify(studyLogs));
    } catch (e) {}
  }, [studyLogs]);

  // Note: persistence (localStorage) intentionally disabled per feature requirements.

  const addStudyTime = (seconds: number) => {
    setStudyTime(prev => prev + seconds);
  };

  const selectSubject = (id: string | null, mode: 'syllabus' | 'notes' | 'lectures' = 'syllabus') => {
    setSelectedSubjectId(id);
    if (id) {
      if (mode === 'syllabus') setView('subjectDetail');
      else if (mode === 'notes') setView('notesSubject');
      else if (mode === 'lectures') setView('lecturesSubject');
    } else {
      if (mode === 'syllabus') setView('subjects');
      else if (mode === 'notes') setView('notes');
      else if (mode === 'lectures') setView('lectures');
    }
  };

  const addTopic = (subjectId: string, topicName: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        const newTopic = { id: `${subjectId}-${Date.now()}`, name: topicName, subtopics: [] };
        return { ...s, topics: [...s.topics, newTopic] };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const addSubtopic = (subjectId: string, topicId: string, subtopicName: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            const newSub = { id: `${topicId}-${Date.now()}`, name: subtopicName, completed: false, weightage: 'Low' as const, revisionCount: 0, links: [], pdfs: [] };
            return { ...t, subtopics: [...t.subtopics, newSub] };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const addLink = (subjectId: string, topicId: string, subtopicId: string, link: Link) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const links = st.links ? [...st.links, link] : [link];
                return { ...st, links };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const addPDF = (subjectId: string, topicId: string, subtopicId: string, pdf: PDFFile) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const pdfs = st.pdfs ? [...st.pdfs, pdf] : [pdf];
                return { ...st, pdfs };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const deletePDF = (subjectId: string, topicId: string, subtopicId: string, pdfId: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const pdfs = (st.pdfs || []).filter(p => p.id !== pdfId);
                return { ...st, pdfs };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const setPdfLastOpened = (subjectId: string, topicId: string, subtopicId: string, pdfId: string, page: number) => {
    setSubjects(prev => {
      // Find the current PDF to check if the page actually changed
      const subject = prev.find(s => s.id === subjectId);
      const topic = subject?.topics.find(t => t.id === topicId);
      const subtopic = topic?.subtopics.find(st => st.id === subtopicId);
      const pdf = subtopic?.pdfs?.find(p => p.id === pdfId);

      // If page hasn't changed, return previous state to avoid re-render
      if (pdf?.lastOpenedPage === page) return prev;

      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const pdfs = (st.pdfs || []).map(p => p.id === pdfId ? { ...p, lastOpenedPage: page } : p);
                return { ...st, pdfs };
              })
            };
          })
        };
      });
      return next;
    });
  };

  const addVideo = (subjectId: string, topicId: string, subtopicId: string, video: VideoFile) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const videos = st.videos ? [...st.videos, video] : [video];
                return { ...st, videos };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const deleteVideo = (subjectId: string, topicId: string, subtopicId: string, videoId: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                const videos = (st.videos || []).filter(v => v.id !== videoId);
                return { ...st, videos };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const deleteSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.filter(st => st.id !== subtopicId)
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  

  const toggleSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
    setSubjects(prev => {
      const next = prev.map(s => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.id !== topicId) return t;
            return {
              ...t,
              subtopics: t.subtopics.map(st => {
                if (st.id !== subtopicId) return st;
                return { ...st, completed: !st.completed };
              })
            };
          })
        };
      });
      setOverallProgress(calculateProgress(next));
      return next;
    });
  };

  const addStudyLog = (log: Omit<StudyLog, 'id' | 'date'> & { date?: string }) => {
    const newLog: StudyLog = {
      ...log,
      id: Date.now().toString(),
      date: log.date || new Date().toISOString()
    };
    setStudyLogs(prev => [newLog, ...prev]);
  };

  const deleteStudyLog = (id: string) => {
    setStudyLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <AppContext.Provider value={{ subjects, tasks, overallProgress, studyTime, addStudyTime, toggleSubtopic, view, setView, selectedSubjectId, selectSubject, addTopic, addSubtopic, addLink, addPDF, deletePDF, setPdfLastOpened, addVideo, deleteVideo, deleteSubtopic, studyLogs, addStudyLog, deleteStudyLog }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
