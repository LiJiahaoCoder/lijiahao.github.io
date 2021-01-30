import React, { useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import {
  Directory as DirectoryIcon,
  DirectorySelected as DirectorySelectedIcon,
} from '~/assets/icons';

import styles from './index.scss';

const DIRECTORY = 'directory';
const DIRECTORY_ICON = 'directoryIcon';
const DIRECTORY_NAME = 'directoryName';
const DirectoryButtonIds: string[] = [ DIRECTORY, DIRECTORY_ICON, DIRECTORY_NAME ];

interface IProps {
  name: string;
}

export default function Directory ({ name }: IProps) {
  let DirectoryElements: Array<HTMLElement | EventTarget | null> = [];
  const [selectedClass, setSelectedClass] = useState('');

  const handleClickDirectory = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setSelectedClass('selected');
  };

  const handleDoubleClickDirectory = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setSelectedClass('');
  };

  const handleUnselecteDirectory = ({ target }: MouseEvent) => {
    if (!DirectoryElements.includes(target)) {
      setSelectedClass('');
    }
  };

  useEffect(() => {
    DirectoryElements = DirectoryButtonIds.map((id) => document.getElementById(id));

    document.addEventListener('click', handleUnselecteDirectory);

    return function clear () {
      document.removeEventListener('click', handleUnselecteDirectory);
    };
  }, []);

  return <div
    id={DIRECTORY}
    onClick={handleClickDirectory}
    onDoubleClick={handleDoubleClickDirectory}
    className={`${styles.directoryWrapper} ${styles[selectedClass]}`}
  >
    <img
      id={DIRECTORY_ICON}
      className={styles.icon}
      src={ selectedClass ? DirectorySelectedIcon : DirectoryIcon}
    />
    <div id={DIRECTORY_NAME} className={styles.directoryName}>{ name }</div>
  </div>;
}
