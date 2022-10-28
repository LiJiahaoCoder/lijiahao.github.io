import React, { useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import {
  Directory as DirectoryIcon,
  DirectorySelected as DirectorySelectedIcon,
} from '../../assets/icons';
import { TitleKey } from '../../typings/articles';

import * as styles from './index.module.scss';

const DIRECTORY = 'directory';
const DIRECTORY_ICON = 'directoryIcon';
const DIRECTORY_NAME = 'directoryName';

interface IProps {
  name: TitleKey;
  onOpenDirectory: (title: TitleKey) => void;
}

export default function Directory ({ name, onOpenDirectory }: IProps) {
  let DirectoryElements: Array<HTMLElement | EventTarget | null> = [];
  const ids = [`${DIRECTORY}_${name}`, `${DIRECTORY_ICON}_${name}`, `${DIRECTORY_NAME}_${name}`];
  const [selectedClass, setSelectedClass] = useState('');

  const handleClickDirectory = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setSelectedClass('selected');
  };

  const handleDoubleClickDirectory = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setSelectedClass('');
    onOpenDirectory(name);
  };

  const handleUnselecteDirectory = ({ target }: MouseEvent) => {
    if (!DirectoryElements.includes(target)) {
      setSelectedClass('');
    }
  };

  useEffect(() => {
    DirectoryElements = ids.map((id) => document.getElementById(id));

    document.addEventListener('click', handleUnselecteDirectory);

    return function clear () {
      document.removeEventListener('click', handleUnselecteDirectory);
    };
  }, []);

  return <div
    id={ids[0]}
    onClick={handleClickDirectory}
    onDoubleClick={handleDoubleClickDirectory}
    className={`${styles.directoryWrapper} ${styles[selectedClass]}`}
  >
    <img
      id={ids[1]}
      className={styles.icon}
      src={selectedClass ? DirectorySelectedIcon : DirectoryIcon}
    />
    <div id={ids[2]} className={styles.directoryName}>{name}</div>
  </div>;
}
