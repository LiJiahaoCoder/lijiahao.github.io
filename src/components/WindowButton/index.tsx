import React, { useEffect, useState } from 'react';
import { WindowsXpIcon } from '../../assets/icons';
import WindowsPanel from '../WindowsPanel';
import styles from './index.scss';

const WindowsButtonIds: string[] = [
  'windows-button',
  'windows-icon',
  'windows-text',
];

export default function WindowButton () {
  let WindowsButtonElements: Array<HTMLElement | EventTarget | null> = [];
  const [hidden, setHidden] = useState(true);

  function hiddenWindowsPanel ({ target }: MouseEvent) {
    if (!WindowsButtonElements.includes(target)) {
      setHidden(true);
    }
  }

  function handleHidePanel () {
    setHidden((value) => !value);
  }

  useEffect(() => {
    WindowsButtonElements = WindowsButtonIds.map((id) => document.getElementById(id));

    addEventListener('click', hiddenWindowsPanel);

    return function clear () {
      document.removeEventListener('click', hiddenWindowsPanel);
    };
  }, []);

  return <>
    <WindowsPanel hidden={hidden} />
    <section
      id='windows-button'
      className={styles['windows-button']}
      onClick={handleHidePanel}
    >
      <img
        id='windows-icon'
        className={styles['windows-icon']}
        src={WindowsXpIcon}
      />
      <i
        id='windows-text'
        className={styles['windows-text']}
      >
        开始
      </i>
    </section>
  </>;
}
