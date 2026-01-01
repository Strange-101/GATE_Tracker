export interface Subtopic {
  id: string;
  name: string;
  completed: boolean;
  weightage: 'High' | 'Medium' | 'Low';
  lastRevised?: Date;
  revisionCount: number;
  links?: Link[];
  pdfs?: PDFFile[];
  videos?: VideoFile[];
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

export interface Link {
  id: string;
  title: string;
  url: string;
  type?: 'Lecture' | 'Blog' | 'Notes' | string;
  lastAccessed?: number;
}

export interface PDFFile {
  id: string;
  name: string;
  dataUrl?: string; // base64 or object URL stored for persistence
  lastOpenedPage?: number;
  lastAccessed?: number;
}

export interface VideoFile {
  id: string;
  name: string;
  url: string; // URL to video (YouTube, Drive, etc.) or local blob URL
  type: 'Link' | 'File';
  lastAccessed?: number;
}

export interface StudyLog {
  id: string;
  date: string; // ISO string
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
  notes?: string;
}

export const SYLLABUS: Subject[] = [
  {
    id: 'em',
    name: 'Engineering Mathematics',
    color: 'var(--accent-blue)',
    topics: [
      {
        id: 'em-1',
        name: 'Linear Algebra',
        subtopics: [
          { id: 'em-1-1', name: 'Matrices and Determinants', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'em-1-2', name: 'Systems of Linear Equations', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'em-1-3', name: 'Eigenvalues and Eigenvectors', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'em-2',
        name: 'Calculus',
        subtopics: [
          { id: 'em-2-1', name: 'Limits and Continuity', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'em-2-2', name: 'Differentiation and Integration', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'em-2-3', name: 'Sequence and Series', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'em-3',
        name: 'Probability & Statistics',
        subtopics: [
          { id: 'em-3-1', name: 'Probability Theory', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'em-3-2', name: 'Random Variables & Distributions', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'em-3-3', name: 'Sampling & Estimation', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'em-4',
        name: 'Numerical Methods and ODEs',
        subtopics: [
          { id: 'em-4-1', name: 'Numerical Integration & Differentiation', completed: false, weightage: 'Low', revisionCount: 0 },
          { id: 'em-4-2', name: 'Numerical Solution of Equations', completed: false, weightage: 'Low', revisionCount: 0 },
          { id: 'em-4-3', name: 'Ordinary Differential Equations', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'dl',
    name: 'Digital Logic',
    color: 'var(--accent-cyan)',
    topics: [
      {
        id: 'dl-1',
        name: 'Boolean Algebra & Logic Gates',
        subtopics: [
          { id: 'dl-1-1', name: 'Boolean Functions & Simplification', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'dl-1-2', name: 'K-maps and Minimization', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'dl-2',
        name: 'Combinational & Sequential Circuits',
        subtopics: [
          { id: 'dl-2-1', name: 'Adders, Multiplexers, Encoders', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'dl-2-2', name: 'Flip-flops, Counters & Registers', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'coa',
    name: 'Computer Organization & Architecture',
    color: 'var(--accent-blue)',
    topics: [
      {
        id: 'coa-1',
        name: 'Machine Instructions & Addressing',
        subtopics: [
          { id: 'coa-1-1', name: 'Instruction Set Architectures', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'coa-1-2', name: 'Addressing Modes', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'coa-2',
        name: 'Processor Design',
        subtopics: [
          { id: 'coa-2-1', name: 'Pipelines and Hazards', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'coa-2-2', name: 'Control Unit', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'coa-3',
        name: 'Memory Hierarchy',
        subtopics: [
          { id: 'coa-3-1', name: 'Cache Organization & Mapping', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'coa-3-2', name: 'Virtual Memory', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'pds',
    name: 'Programming & Data Structures',
    color: 'var(--accent-green)',
    topics: [
      {
        id: 'pds-1',
        name: 'Programming Concepts',
        subtopics: [
          { id: 'pds-1-1', name: 'Basic Constructs and Control Flow', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'pds-1-2', name: 'Recursion', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'pds-2',
        name: 'Data Structures',
        subtopics: [
          { id: 'pds-2-1', name: 'Arrays, Linked Lists', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'pds-2-2', name: 'Stacks, Queues, Hashing', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'pds-2-3', name: 'Trees and Heaps', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'algo',
    name: 'Algorithms',
    color: 'var(--accent-yellow)',
    topics: [
      {
        id: 'algo-1',
        name: 'Algorithm Design',
        subtopics: [
          { id: 'algo-1-1', name: 'Asymptotic Analysis', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'algo-1-2', name: 'Divide & Conquer', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'algo-1-3', name: 'Dynamic Programming', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'algo-2',
        name: 'Graph Algorithms',
        subtopics: [
          { id: 'algo-2-1', name: 'BFS/DFS', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'algo-2-2', name: 'Shortest Paths & MST', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'algo-3',
        name: 'Sorting & Searching',
        subtopics: [
          { id: 'algo-3-1', name: 'Comparison Sorts', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'algo-3-2', name: 'Binary Search & Hashing', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'toc',
    name: 'Theory of Computation',
    color: 'var(--accent-blue)',
    topics: [
      {
        id: 'toc-1',
        name: 'Automata',
        subtopics: [
          { id: 'toc-1-1', name: 'Regular Languages & Finite Automata', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'toc-1-2', name: 'Context Free Grammars & Pushdown Automata', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'toc-2',
        name: 'Computability & Complexity',
        subtopics: [
          { id: 'toc-2-1', name: 'Turing Machines', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'toc-2-2', name: 'P, NP and NP-Completeness', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'cd',
    name: 'Compiler Design',
    color: 'var(--accent-pink)',
    topics: [
      {
        id: 'cd-1',
        name: 'Lexical & Syntax Analysis',
        subtopics: [
          { id: 'cd-1-1', name: 'Lexical Analysis & Regular Expressions', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'cd-1-2', name: 'Parsing Techniques (LL, LR)', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'cd-2',
        name: 'Code Generation & Optimization',
        subtopics: [
          { id: 'cd-2-1', name: 'Intermediate Code', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'cd-2-2', name: 'Code Optimization Techniques', completed: false, weightage: 'Medium', revisionCount: 0 },
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
        name: 'Process, Threads & Concurrency',
        subtopics: [
          { id: 'os-1-1', name: 'Processes and Threads', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'os-1-2', name: 'CPU Scheduling Algorithms', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'os-1-3', name: 'Synchronization & Deadlocks', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'os-2',
        name: 'Memory & Storage',
        subtopics: [
          { id: 'os-2-1', name: 'Memory Management & Paging', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'os-2-2', name: 'File Systems', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'db',
    name: 'Databases',
    color: 'var(--accent-green)',
    topics: [
      {
        id: 'db-1',
        name: 'Relational Databases',
        subtopics: [
          { id: 'db-1-1', name: 'ER-model and Relational Model', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'db-1-2', name: 'SQL and Normalization', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'db-2',
        name: 'Transaction Management & Indexing',
        subtopics: [
          { id: 'db-2-1', name: 'Transactions and Concurrency Control', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'db-2-2', name: 'Indexing & Query Optimization', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'cn',
    name: 'Computer Networks',
    color: 'var(--accent-cyan)',
    topics: [
      {
        id: 'cn-1',
        name: 'Network Fundamentals',
        subtopics: [
          { id: 'cn-1-1', name: 'OSI and TCP/IP Models', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'cn-1-2', name: 'Switching and Routing', completed: false, weightage: 'High', revisionCount: 0 },
        ],
      },
      {
        id: 'cn-2',
        name: 'Transport & Application Layers',
        subtopics: [
          { id: 'cn-2-1', name: 'TCP/UDP and Flow Control', completed: false, weightage: 'High', revisionCount: 0 },
          { id: 'cn-2-2', name: 'HTTP, DNS, SMTP', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
    ],
  },

  {
    id: 'se',
    name: 'Software Engineering & Project Management',
    color: 'var(--accent-yellow)',
    topics: [
      {
        id: 'se-1',
        name: 'Software Processes',
        subtopics: [
          { id: 'se-1-1', name: 'Software Development Life Cycle', completed: false, weightage: 'Medium', revisionCount: 0 },
          { id: 'se-1-2', name: 'Agile and DevOps', completed: false, weightage: 'Medium', revisionCount: 0 },
        ],
      },
      {
        id: 'se-2',
        name: 'Project Management',
        subtopics: [
          { id: 'se-2-1', name: 'Estimation Techniques', completed: false, weightage: 'Low', revisionCount: 0 },
          { id: 'se-2-2', name: 'Risk Management', completed: false, weightage: 'Low', revisionCount: 0 },
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
