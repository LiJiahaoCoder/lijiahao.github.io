import React, { useEffect, useState } from 'react';
import WindowButton from '~/components/window-button';

import styles from './index.scss';

export default function TaskBar () {
  const [time, setTime] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);

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

  return <footer className={styles.taskBarContainer}>
    <WindowButton />
    <section className={styles.taskArea}>{time}</section>
  </footer>;
}
