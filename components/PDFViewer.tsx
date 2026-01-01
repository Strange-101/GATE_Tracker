"use client"

import React, { useEffect, useRef, useState } from 'react';
import styles from './Notes.module.css';

interface Props {
  dataUrl: string;
  initialPage?: number;
  onClose?: () => void;
  onPageChange?: (page: number) => void;
}

// Iframe-based PDF viewer using the browser's native PDF renderer.
// This keeps the bundle free of server-only modules like `canvas`.
const PDFViewer: React.FC<Props> = ({ dataUrl, initialPage = 1, onClose, onPageChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [pageNum, setPageNum] = useState(initialPage);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!iframeRef.current) return;
    const src = `${dataUrl}#page=${pageNum}&zoom=${zoom}`;
    iframeRef.current.src = src;
    onPageChange && onPageChange(pageNum);
  }, [dataUrl, pageNum, zoom, onPageChange]);

  const next = () => setPageNum(p => p + 1);
  const prev = () => setPageNum(p => Math.max(1, p - 1));
  const zoomIn = () => setZoom(z => Math.min(500, z + 25));
  const zoomOut = () => setZoom(z => Math.max(25, z - 25));
  const toggleFull = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className={styles.viewerContainer} ref={containerRef}>
      <div className={styles.viewerToolbar}>
        <button onClick={prev}>Prev</button>
        <span>Page {pageNum}</span>
        <button onClick={next}>Next</button>
        <button onClick={zoomOut}>-</button>
        <span>{zoom}%</span>
        <button onClick={zoomIn}>+</button>
        <button onClick={toggleFull}>Fullscreen</button>
        {onClose && <button onClick={onClose}>Close</button>}
      </div>
      <div className={styles.viewerIframeWrap}>
        <iframe ref={iframeRef} title="pdf-viewer" src={`${dataUrl}#page=${initialPage}&zoom=${zoom}`} style={{ width: '100%', height: '80vh', border: 'none' }} />
      </div>
    </div>
  );
};

export default PDFViewer;
