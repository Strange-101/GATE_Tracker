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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(SYLLABUS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [overallProgress, setOverallProgress] = useState(10);
  const [studyTime, setStudyTime] = useState(0);

  // Load state
  useEffect(() => {
    const saved = localStorage.getItem('gate_dashboard_data');
    if (saved) {
      try {
        const { subjects: s, overallProgress: op, studyTime: st } = JSON.parse(saved);
        setSubjects(s);
        setOverallProgress(op);
        if (st) setStudyTime(st);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('gate_dashboard_data', JSON.stringify({ subjects, overallProgress, studyTime }));
  }, [subjects, overallProgress, studyTime]);

  const addStudyTime = (seconds: number) => {
    setStudyTime(prev => prev + seconds);
  };

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
    return Math.round((completed / total) * 100);
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
    <AppContext.Provider value={{ subjects, tasks, overallProgress, studyTime, addStudyTime, toggleSubtopic }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
