"use client"

import React from 'react';
import styles from './Sidebar.module.css';
import { useApp } from '@/lib/store';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Video, 
  CheckSquare, 
  Settings 
} from 'lucide-react';
import StudyTimer from './StudyTimer';

const Sidebar = () => {
  const { overallProgress } = useApp();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <BookOpen size={20} />, label: 'Subjects' },
    { icon: <FileText size={20} />, label: 'Notes' },
    { icon: <Video size={20} />, label: 'Lectures' },
    { icon: <CheckSquare size={20} />, label: 'Tasks' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  // Circle math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallProgress / 100) * circumference;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>G</div>
        <span className={styles.logoText}>GATE CS</span>
      </div>

      <div className={styles.overallProgress}>
        <div className={styles.progressCircle}>
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-blue)" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r={radius} className={styles.bg} />
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              className={styles.fg} 
              style={{ 
                strokeDasharray: circumference, 
                strokeDashoffset: offset,
                stroke: 'url(#progressGradient)'
              }} 
            />
          </svg>
          <div className={styles.progressText}>
            <span className={styles.percentage}>{overallProgress}%</span>
            <span className={styles.label}>Syllabus</span>
          </div>
        </div>
      </div>

      <div className={styles.subjectMiniCharts}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.miniBar}>
            <div className={styles.barFill} style={{ height: `${20 * i}%` }}></div>
          </div>
        ))}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, index) => (
          <button key={index} className={`${styles.navItem} ${item.active ? styles.active : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.timerWrapper}>
        <StudyTimer />
      </div>
    </aside>
  );
};

export default Sidebar;
