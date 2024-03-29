import React, { ReactNode } from 'react';

import * as styles from './index.module.scss';

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
    <main className={styles.content}>
      { children }
    </main>
  </div>;
}
