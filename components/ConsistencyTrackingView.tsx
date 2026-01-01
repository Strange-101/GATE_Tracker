"use client"

import React, { useState, useMemo } from 'react';
import styles from './ConsistencyTrackingView.module.css';
import { useApp } from '@/lib/store';
import { Calendar as CalendarIcon, Plus, BookOpen, Clock, ChevronRight, Trash2, ChevronDown, Check, ChevronLeft } from 'lucide-react';

interface CustomSelectProps {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id === value);

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.customSelectContainer}>
        <div 
          className={`${styles.customSelectTrigger} ${isOpen ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span style={{ color: selectedOption ? 'var(--text-main)' : 'var(--text-muted)' }}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown size={16} className={styles.arrow} style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s'
          }} />
        </div>
        
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {options.map(opt => (
              <div 
                key={opt.id} 
                className={`${styles.dropdownOption} ${opt.id === value ? styles.selected : ''}`}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
              >
                {opt.name}
                {opt.id === value && <Check size={14} style={{ marginLeft: 'auto' }} />}
              </div>
            ))}
            {options.length === 0 && (
              <div className={styles.dropdownOption} style={{ pointerEvents: 'none' }}>
                No options available
              </div>
            )}
          </div>
        )}
      </div>
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
    </div>
  );
};

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value));
  const selectedDate = new Date(value);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (delta: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  };

  const isToday = (d: number) => {
    const today = new Date();
    return d === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (d: number) => {
    return d === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
  };

  const isFuture = (d: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    return date > new Date();
  };

  const days = useMemo(() => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const result = [];
    
    for (let i = 0; i < startOffset; i++) result.push(null);
    for (let i = 1; i <= totalDays; i++) result.push(i);
    
    return result;
  }, [viewDate]);

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.customSelectContainer}>
        <div 
          className={`${styles.customSelectTrigger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarIcon size={16} style={{ color: 'var(--accent-blue)' }} />
            <span>{selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <ChevronDown size={16} style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
            opacity: 0.5
          }} />
        </div>

        {isOpen && (
          <div className={styles.calendarDropdown}>
            <div className={styles.calendarHeader}>
              <button className={styles.calNavBtn} onClick={() => changeMonth(-1)}><ChevronLeft size={16} /></button>
              <div className={styles.currentMonth}>
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button className={styles.calNavBtn} onClick={() => changeMonth(1)} disabled={viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear()}><ChevronRight size={16} /></button>
            </div>
            
            <div className={styles.calendarGrid}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className={styles.weekday}>{day}</div>
              ))}
              {days.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`
                    ${styles.dayCell} 
                    ${day === null ? styles.empty : ''} 
                    ${day !== null && isToday(day) ? styles.today : ''} 
                    ${day !== null && isSelected(day) ? styles.selectedDay : ''}
                    ${day !== null && isFuture(day) ? styles.future : ''}
                  `}
                  onClick={() => {
                    if (day !== null && !isFuture(day)) {
                      onChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toISOString().split('T')[0]);
                      setIsOpen(false);
                    }
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
    </div>
  );
};

const ConsistencyTrackingView: React.FC = () => {
  const { subjects, addStudyLog, studyLogs, deleteStudyLog } = useApp();
  
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [notes, setNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const currentSubject = useMemo(() => 
    subjects.find(s => s.id === selectedSub), 
  [subjects, selectedSub]);

  const currentTopic = useMemo(() => 
    currentSubject?.topics.find(t => t.id === selectedTopic), 
  [currentSubject, selectedTopic]);

  const handleLog = () => {
    if (!selectedSub || !selectedTopic || !selectedSubtopic) return;

    const topic = currentSubject!.topics.find(t => t.id === selectedTopic)!;
    const subtopic = topic.subtopics.find(st => st.id === selectedSubtopic)!;

    addStudyLog({
      subjectId: selectedSub,
      subjectName: currentSubject!.name,
      topicId: selectedTopic,
      topicName: topic.name,
      subtopicId: selectedSubtopic,
      subtopicName: subtopic.name,
      notes: notes.trim() || undefined,
      date: new Date(logDate).toISOString()
    });

    // Reset form
    setSelectedSub('');
    setSelectedTopic('');
    setSelectedSubtopic('');
    setNotes('');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logCard}>
        <div className={styles.cardHeader}>
          <Plus size={20} className={styles.icon} style={{ color: 'var(--accent-blue)' }} />
          <h3>Log Study Session</h3>
        </div>

        <div className={styles.formGrid}>
          <CustomSelect 
            label="Subject"
            value={selectedSub}
            options={subjects}
            placeholder="Select Subject"
            onChange={val => { setSelectedSub(val); setSelectedTopic(''); setSelectedSubtopic(''); }}
          />

          <CustomSelect 
            label="Topic"
            value={selectedTopic}
            options={currentSubject?.topics || []}
            placeholder="Select Topic"
            disabled={!selectedSub}
            onChange={val => { setSelectedTopic(val); setSelectedSubtopic(''); }}
          />

          <CustomSelect 
            label="Subtopic"
            value={selectedSubtopic}
            options={currentTopic?.subtopics || []}
            placeholder="Select Subtopic"
            disabled={!selectedTopic}
            onChange={val => setSelectedSubtopic(val)}
          />

          <CustomDatePicker 
            label="Session Date"
            value={logDate}
            onChange={val => setLogDate(val)}
          />
        </div>

        <div className={styles.field} style={{ marginBottom: '1.5rem' }}>
          <label>Notes (Optional)</label>
          <textarea 
            className={styles.textarea}
            placeholder="What did you learn? Any key points or doubts?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <button 
          className={styles.logBtn}
          onClick={handleLog}
          disabled={!selectedSubtopic}
        >
          <CalendarIcon size={18} />
          Log Study Session
        </button>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.cardHeader}>
          <Clock size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h3>Recent Activity</h3>
        </div>
        
        <div className={styles.logList}>
          {studyLogs.length > 0 ? (
            studyLogs.map(log => (
              <div key={log.id} className={styles.logItem}>
                <div className={styles.logInfo}>
                  <h4>{log.subtopicName}</h4>
                  <div className={styles.logMeta}>
                    {log.subjectName} <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {log.topicName}
                  </div>
                  {log.notes && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', borderLeft: '2px solid var(--border-color)', paddingLeft: '0.75rem' }}>
                      {log.notes}
                    </p>
                  )}
                </div>
                <div className={styles.logDate}>
                  <div>{formatDate(log.date)}</div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => { if(confirm('Delete this log?')) deleteStudyLog(log.id); }}
                    title="Delete Log"
                    style={{ 
                      marginTop: '0.5rem', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--accent-red, #ff4444)', 
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No study sessions logged yet. Start tracking your progress!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsistencyTrackingView;
