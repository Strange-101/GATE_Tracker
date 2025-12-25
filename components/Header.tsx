"use client"

import React from 'react';
import styles from './Header.module.css';
import { Search, Plus, Book, FileText, Video } from 'lucide-react';
import { useApp } from '@/lib/store';

const Header = () => {
  const { view } = useApp();
  const title = view === 'dashboard' ? 'Dashboard' : view === 'subjects' ? 'Subjects' : 'Subject Detail';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.yearSelector}>
          <select>
            <option>GATE 2025</option>
            <option>GATE 2026</option>
          </select>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search topics, notes, lectures..." />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <Plus size={16} />
            <span>Topic</span>
          </button>
          <button className={styles.actionBtn}>
            <Plus size={16} />
            <span>Note</span>
          </button>
          <button className={styles.actionBtn}>
            <Plus size={16} />
            <span>Lecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
