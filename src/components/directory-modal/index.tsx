import React from 'react';

import styles from './index.scss';

interface IProps {
  title: string;
  visible: boolean;
}

export default function DirectoryModal ({ title, visible }: IProps) {
  return <section className={visible ? styles.visible : ''}>
    <div className={styles.bar}>{title}</div>
  </section>;
}
