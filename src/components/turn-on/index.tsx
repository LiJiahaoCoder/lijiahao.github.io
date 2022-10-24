import React, { useEffect, useState } from 'react';

import styles from './index.module.scss';

const BlueBorder = () => <div className={styles.turnOnBorder} />;
const TurnOnInterface = () => <div className={styles.turnOnContainer}>
    <BlueBorder />
    <div className={styles.turnOnContent}>
      <span className={styles.welcomeText}>欢迎使用</span>
    </div>
    <BlueBorder />
  </div>;

export default function TurnOn () {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const id: number = setTimeout(() => {
      clearTimeout(timer);
      setTimer(0);
    }, 3000);

    setTimer(id);

    return function clear () {
      clearTimeout(timer);
    };
  }, []);

  return timer ? <TurnOnInterface /> : null;
}
