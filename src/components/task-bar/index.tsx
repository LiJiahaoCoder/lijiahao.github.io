import React, { useEffect, useState } from 'react';
import AboutMe from '../../articles/about-me.md';
import { AboutMeIcon } from '../../assets/icons';
import Markdown from '../markdown';
import Modal from '../modal';
import WindowButton from '../window-button';

import * as styles from './index.module.scss';

export default function TaskBar () {
  const [time, setTime] = useState('');
  const [timer, setTimer] = useState(0);
  const [visible, setVisible] = useState(false);

  const getCurrentTime = (): string => {
    return new Date().toLocaleString().split(', ')[1];
  };

  useEffect(() => {
    setTime(getCurrentTime());

    const id = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);
    setTimer(id);

    return function clear () {
      clearInterval(timer);
    };
  }, []);

  return <>
    <footer className={styles.taskBarContainer}>
      <WindowButton />
      <section className={styles.taskArea}>
        <img
          className={styles.aboutMeIcon}
          title='关于我'
          src={AboutMeIcon}
          onClick={() => {
            setVisible(true);
          }}
        />
        <span>{time}</span>
      </section>
    </footer>
    <Modal
      visible={visible}
      title='关于我'
      onClose={() => {
        setVisible(false);
      }}
    >
      <Markdown children={AboutMe} />
    </Modal>
  </>;
}
