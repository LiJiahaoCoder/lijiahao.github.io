import React, { useState, MouseEvent } from 'react';
import { Directory as DirectoryIcon, DirectorySelected as DirectorySelectedIcon } from '~/assets/icons';

import styles from './index.scss';

interface IProps {
  name: string;
}

export default function Directory ({ name }: IProps) {
  const [selectedClass, setSelectedClass] = useState('');

  const handleClickDirectory = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedClass('selected');
  };

  const handleDoubleClickDirectory = (e: MouseEvent) => {
    e.stopPropagation();
    setSelectedClass('');
  };

  return <div
    onClick={handleClickDirectory}
    onDoubleClick={handleDoubleClickDirectory}
    className={`${styles['directory-wrapper']} ${styles[selectedClass]}`}
  >
    <img
      className={styles.icon}
      src={ selectedClass ? DirectorySelectedIcon : DirectoryIcon}
      alt='哦豁，出错了！'
    />
    <div className={styles['directory-name']}>{name}</div>
  </div>;
}
