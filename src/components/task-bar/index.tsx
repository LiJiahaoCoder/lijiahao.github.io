import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import AboutMe from '../../articles/about-me.md';
import { AboutMeIcon } from '../../assets/icons';
import Modal from '../../components/modal';
import WindowButton from '../../components/window-button';

import styles from './index.module.scss';

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
        <span className={styles.time}>{time}</span>
      </section>
    </footer>
    <Modal
      visible={visible}
      title='关于我'
      onClose={() => {
        setVisible(false);
      }}
    >
      <main className={styles.markdownContainer}>
        <ReactMarkdown children={AboutMe} />
      </main>
    </Modal>
  </>;
}
