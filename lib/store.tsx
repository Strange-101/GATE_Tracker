"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, SYLLABUS, MOCK_TASKS } from './data';

interface AppContextType {
  subjects: Subject[];
  tasks: any[];
  overallProgress: number;
  studyTime: number; // in seconds
  addStudyTime: (seconds: number) => void;
  toggleSubtopic: (subjectId: string, topicId: string, subtopicId: string) => void;
  // navigation state
  view: 'dashboard' | 'subjects' | 'subjectDetail';
  setView: (v: 'dashboard' | 'subjects' | 'subjectDetail') => void;
  selectedSubjectId?: string | null;
  selectSubject: (id: string | null) => void;
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
  const [view, setView] = useState<'dashboard' | 'subjects' | 'subjectDetail'>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Note: persistence (localStorage) intentionally disabled per feature requirements.

  const addStudyTime = (seconds: number) => {
    setStudyTime(prev => prev + seconds);
  };

  const selectSubject = (id: string | null) => {
    setSelectedSubjectId(id);
    if (id) setView('subjectDetail');
    else setView('subjects');
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

  return (
    <AppContext.Provider value={{ subjects, tasks, overallProgress, studyTime, addStudyTime, toggleSubtopic, view, setView, selectedSubjectId, selectSubject }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
