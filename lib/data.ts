export interface Subtopic {
  id: string;
  name: string;
  completed: boolean;
  weightage: 'High' | 'Medium' | 'Low';
  lastRevised?: Date;
  revisionCount: number;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
  color: string;
}

export const SYLLABUS: Subject[] = [
  {
    id: 'ds',
    name: 'Data Structures',
    color: 'var(--accent-blue)',
    topics: [
      {
        id: 'ds-1',
        name: 'Linear Data Structures',
        subtopics: [
          { id: 'ds-1-1', name: 'Arrays & Matrices', completed: true, weightage: 'High', revisionCount: 1, lastRevised: new Date() },
          { id: 'ds-1-2', name: 'Linked Lists', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'ds-1-3', name: 'Stacks & Queues', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'ds-2',
        name: 'Trees',
        subtopics: [
          { id: 'ds-2-1', name: 'Binary Trees', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'ds-2-2', name: 'Binary Search Trees', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'ds-2-3', name: 'AVL & B-Trees', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },
  {
    id: 'os',
    name: 'Operating Systems',
    color: 'var(--accent-pink)',
    topics: [
      {
        id: 'os-1',
        name: 'Process Management',
        subtopics: [
          { id: 'os-1-1', name: 'Wait/Signal & Semaphores', completed: true, weightage: 'High', revisionCount: 2, lastRevised: new Date() },
          { id: 'os-1-2', name: 'Deadlocks', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
    ],
  },
];

export const MOCK_TASKS = [
  { id: 't1', title: 'Revise Deadlocks', subject: 'OS', dueDate: 'Today', priority: 'High', type: 'Revision' },
  { id: 't2', title: 'Solve Array PYQs', subject: 'DS', dueDate: 'Tomorrow', priority: 'Medium', type: 'PYQ' },
  { id: 't3', title: 'Watch TCP Lecture', subject: 'CN', dueDate: 'Dec 25', priority: 'Low', type: 'Lecture' },
];
