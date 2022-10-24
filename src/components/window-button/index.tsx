import React, { useEffect, useState } from 'react';
import { WindowsXpIcon } from '../../assets/icons';
import WindowsPanel from '../../components/windows-panel';

import styles from './index.module.scss';

const WINDOWS_BUTTON = 'windowsButton';
const WINDOWS_ICON = 'windowsIcon';
const WINDOWS_TEXT = 'windowsText';
const WindowsButtonIds: string[] = [ WINDOWS_BUTTON, WINDOWS_ICON, WINDOWS_TEXT ];

export default function WindowButton () {
  let WindowsButtonElements: Array<HTMLElement | EventTarget | null> = [];
  const [hidden, setHidden] = useState(true);

  const hideWindowsPanel = ({ target }: MouseEvent) => {
    if (!WindowsButtonElements.includes(target)) {
      setHidden(true);
    }
  };

  const handleClickWindowsButton = () => {
    setHidden((value) => !value);
  };

  useEffect(() => {
    WindowsButtonElements = WindowsButtonIds.map((id) => document.getElementById(id));

    document.addEventListener('click', hideWindowsPanel);

    return function clear () {
      document.removeEventListener('click', hideWindowsPanel);
    };
  }, []);

  return <>
    <WindowsPanel hidden={hidden} />
    <div className={styles.windowsButtonWrapper}>
      <section
        id={WINDOWS_BUTTON}
        className={`${styles.windowsButton} ${styles.windowsHoveredButton}`}
      >
        <img
          id={WINDOWS_ICON}
          className={styles.windowsIcon}
          src={WindowsXpIcon}
        />
        <i id={WINDOWS_TEXT} className={styles.windowsText}>开始</i>
      </section>
      <section
        id={WINDOWS_BUTTON}
        className={`${styles.windowsButton} ${styles.windowsUnhoveredButton}`}
      >
        <img
          id={WINDOWS_ICON}
          className={styles.windowsIcon}
          src={WindowsXpIcon}
        />
        <i id={WINDOWS_TEXT} className={styles.windowsText}>开始</i>
      </section>
    </div>
  </>;
}
