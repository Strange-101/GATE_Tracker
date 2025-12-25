"use client"

import React from 'react';
import styles from './ProgressBar.module.css';

interface Props {
  value: number;
  color?: string;
  labelLeft?: string;
  labelRight?: string;
}

const ProgressBar: React.FC<Props> = ({ value, color = 'var(--accent-cyan)', labelLeft, labelRight }) => {
  return (
    <div>
      {(labelLeft || labelRight) && (
        <div className={styles.labelRow}>
          <div>{labelLeft}</div>
          <div>{labelRight ?? `${value}%`}</div>
        </div>
      )}
      <div className={styles.progressOuter}>
        <div className={styles.progressInner} style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
};

export default ProgressBar;
