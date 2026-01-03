"use client"

import React, { useState } from 'react';
import styles from './TasksView.module.css';
import { useApp } from '@/lib/store';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Tag,
  X,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ListFilter
} from 'lucide-react';
import { Task } from '@/lib/data';

interface CustomSelectProps {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id === value);

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.customSelectContainer}>
        <div 
          className={`${styles.customSelectTrigger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ color: selectedOption ? 'var(--text-main)' : 'var(--text-muted)' }}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown size={16} style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
            opacity: 0.5
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
  const today = new Date();
  const [viewDate, setViewDate] = useState(value ? new Date(value) : today);
  const selectedDate = value ? new Date(value) : null;

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (delta: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  };

  const isToday = (d: number) => {
    return d === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (d: number) => {
    return selectedDate && d === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
  };

  const days = React.useMemo(() => {
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
            <span>{selectedDate ? selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date'}</span>
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
              <button type="button" className={styles.calNavBtn} onClick={() => changeMonth(-1)}><ChevronLeft size={16} /></button>
              <div className={styles.currentMonth}>
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button type="button" className={styles.calNavBtn} onClick={() => changeMonth(1)}><ChevronRight size={16} /></button>
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
                   `}
                   onClick={() => {
                     if (day !== null) {
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

const TasksView = () => {
  const { tasks, addTask, toggleTask, deleteTask, subjects, taskSortBy, setTaskSortBy } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No Date';
    // If it's already human readable (from mock data), return it
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

  const sortedTasks = React.useMemo(() => {
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    
    return [...tasks].sort((a, b) => {
      // First sort by completion (incomplete first)
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      if (taskSortBy === 'Priority') {
        const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
        const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
        if (weightA !== weightB) return weightB - weightA;
      }

      // Default/Secondary sort by date
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
    });
  }, [tasks, taskSortBy]);

  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed'>>({
    title: '',
    subject: subjects[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    type: 'Revision'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setNewTask({
      title: '',
      subject: subjects[0]?.id || '',
      dueDate: '',
      priority: 'Medium',
      type: 'Revision'
    });
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2>Study Tasks</h2>
          <div className={styles.sortControls}>
            <button 
              className={`${styles.sortBtn} ${taskSortBy === 'Date' ? styles.activeSort : ''}`}
              onClick={() => setTaskSortBy('Date')}
            >
              <CalendarIcon size={14} />
              By Date
            </button>
            <button 
              className={`${styles.sortBtn} ${taskSortBy === 'Priority' ? styles.activeSort : ''}`}
              onClick={() => setTaskSortBy('Priority')}
            >
              <ArrowUpDown size={14} />
              By Priority
            </button>
          </div>
        </div>
        <button className={styles.addTaskBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Add New Task
        </button>
      </header>

      <div className={styles.taskGrid}>
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <div key={task.id} className={`${styles.taskCard} ${task.completed ? styles.completed : ''}`}>
              <div className={styles.taskHeader}>
                <h3 className={styles.taskTitle}>{task.title}</h3>
                <div className={styles.priorityBadges}>
                  <span className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className={styles.taskMeta}>
                <div className={styles.metaItem}>
                  <BookOpen 
                    size={14} 
                    style={{ color: subjects.find(s => s.id === task.subject)?.color || 'var(--text-muted)' }} 
                  />
                  <span>{subjects.find(s => s.id === task.subject)?.name || task.subject}</span>
                </div>
                <div className={styles.metaItem}>
                  <CalendarIcon size={14} />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <div className={styles.metaItem}>
                  <Tag size={14} />
                  <span>{task.type}</span>
                </div>
              </div>

              <div className={styles.taskActions}>
                <button 
                  className={`${styles.checkBtn} ${task.completed ? styles.checked : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {task.completed ? 'Completed' : 'Mark Done'}
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No tasks found. Start by adding one!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Add Study Task</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Revise Heaps" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>

              <CustomSelect 
                label="Subject"
                value={newTask.subject}
                placeholder="Select Subject"
                options={[...subjects.map(s => ({ id: s.id, name: s.name })), { id: 'General', name: 'General' }]}
                onChange={val => setNewTask({...newTask, subject: val})}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <CustomDatePicker 
                  label="Due Date"
                  value={newTask.dueDate}
                  onChange={val => setNewTask({...newTask, dueDate: val})}
                />
                
                <CustomSelect 
                  label="Priority"
                  value={newTask.priority}
                  placeholder="Select Priority"
                  options={[
                    { id: 'High', name: 'High' },
                    { id: 'Medium', name: 'Medium' },
                    { id: 'Low', name: 'Low' }
                  ]}
                  onChange={val => setNewTask({...newTask, priority: val as any})}
                />
              </div>

              <CustomSelect 
                label="Category"
                value={newTask.type}
                placeholder="Select Category"
                options={[
                  { id: 'Revision', name: 'Revision' },
                  { id: 'PYQ', name: 'PYQ' },
                  { id: 'Lecture', name: 'Lecture' },
                  { id: 'Mock Test', name: 'Mock Test' }
                ]}
                onChange={val => setNewTask({...newTask, type: val})}
              />

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
