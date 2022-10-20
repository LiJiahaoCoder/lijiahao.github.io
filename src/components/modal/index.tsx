import React, { ReactNode } from 'react';

import styles from './index.scss';

interface IProps {
  title: string;
  visible: boolean;
  children?: ReactNode;
  onClose: () => void;
}

export default function Modal ({
  title,
  visible,
  children,
  onClose,
}: IProps) {
  return <div className={visible ? styles.visible : styles.hidden}>
    <header className={styles.bar}>
      {title}
      <div className={styles.close} onClick={onClose}>×</div>
    </header>
    { children }
  </div>;
}
