import React, { useEffect, useState } from 'react';
import { WindowsXpIcon } from '~/assets/icons';
import WindowsPanel from '~/components/windows-panel';

import styles from './index.scss';

const WINDOWS_BUTTON = 'windows-button';
const WINDOWS_ICON = 'windows-icon';
const WINDOWS_TEXT = 'windows-text';
const WindowsButtonIds: string[] = [ WINDOWS_BUTTON, WINDOWS_ICON, WINDOWS_TEXT ];

export default function WindowButton () {
  let WindowsButtonElements: Array<HTMLElement | EventTarget | null> = [];
  const [hidden, setHidden] = useState(true);

  const hiddenWindowsPanel = ({ target }: MouseEvent) => {
    if (!WindowsButtonElements.includes(target)) {
      setHidden(true);
    }
  };

  const handleClickWindowsButton = () => {
    setHidden((value) => !value);
  };

  useEffect(() => {
    WindowsButtonElements = WindowsButtonIds.map((id) => document.getElementById(id));

    document.addEventListener('click', hiddenWindowsPanel);

    return function clear () {
      document.removeEventListener('click', hiddenWindowsPanel);
    };
  }, []);

  return <>
    <WindowsPanel hidden={hidden} />
    <div className={styles['windows-button-wrapper']}>
      <section
        id={WINDOWS_BUTTON}
        className={`${styles['windows-button']} ${styles['windows-hovered-button']}`}
      >
        <img
          id={WINDOWS_ICON}
          className={styles['windows-icon']}
          src={WindowsXpIcon}
        />
        <i id={WINDOWS_TEXT} className={styles['windows-text']}>开始</i>
      </section>
      <section
        id={WINDOWS_BUTTON}
        className={`${styles['windows-button']} ${styles['windows-unhovered-button']}`}
      >
        <img
          id={WINDOWS_ICON}
          className={styles['windows-icon']}
          src={WindowsXpIcon}
        />
        <i id={WINDOWS_TEXT} className={styles['windows-text']}>开始</i>
      </section>
    </div>
  </>;
}
