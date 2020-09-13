import React, { useState } from 'react';
import { Directory as DirectoryIcon } from '~/assets/icons';

import styles from './index.scss';

interface IProps {
  name: string;
}

export default function Directory ({ name }: IProps) {
  const [selectedClass, setSelectedClass] = useState('');

  const handleClickDirectory = () => {
    setSelectedClass('selected');
  };

  const handleDoubleClickDirectory = () => {
    console.info('Double');
  };

  return <div
    onClick={handleClickDirectory}
    onDoubleClick={handleDoubleClickDirectory}
    className={`${styles['directory-wrapper']} ${styles[selectedClass]}`}
  >
    <img className={styles.icon} src={DirectoryIcon}  alt='哦豁，出错了！'/>
    <div className={styles['directory-name']}>{name}</div>
  </div>;
}
