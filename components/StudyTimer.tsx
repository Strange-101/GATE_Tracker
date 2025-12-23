"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './StudyTimer.module.css';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { useApp } from '@/lib/store';

const StudyTimer = () => {
  const { studyTime, addStudyTime } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dailyGoal = 3600; // 1 hour goal for demonstration

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
        addStudyTime(1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, addStudyTime]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min((studyTime / dailyGoal) * 100, 100);

  return (
    <div className={styles.timerCard}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Target size={16} className={styles.goalIcon} />
          <span>Focus Session</span>
        </div>
        <span className={styles.goalText}>{Math.round(progress)}% of daily goal</span>
      </div>

      <div className={styles.display}>
        {formatTime(seconds)}
      </div>

      <div className={styles.totalTime}>
        Total Today: {formatTime(studyTime)}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
      </div>

      <div className={styles.controls}>
        <button 
          className={`${styles.controlBtn} ${isActive ? styles.pause : styles.play}`}
          onClick={toggleTimer}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button className={styles.resetBtn} onClick={resetTimer}>
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default StudyTimer;
