"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface NotesEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ initialContent = '', onChange }) => {
  const [value, setValue] = useState<string>(initialContent);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <div className="notes-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Write your notes here..."
        style={{ height: '200px', marginBottom: '1rem' }}
      />
    </div>
  );
};

export default NotesEditor;
