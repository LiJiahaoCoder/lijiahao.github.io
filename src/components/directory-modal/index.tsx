import React from 'react';

import styles from './index.scss';

interface IProps {
  title: string;
  visible: boolean;
  onClose: () => void;
}

export default function DirectoryModal ({ title, visible, onClose }: IProps) {
  return <header className={visible ? styles.visible : styles.hidden}>
    <div className={styles.bar}>
      {title}
      <div className={styles.close} onClick={onClose}>×</div>
    </div>
  </header>;
}
