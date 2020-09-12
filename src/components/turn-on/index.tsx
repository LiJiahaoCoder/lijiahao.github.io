import React, { useEffect, useState } from 'react';
import styles from './index.scss';

const BlueBorder = () => <div className={styles['turn-on-border']}></div>;
const TurnOnInterface = () => <div className={styles['turn-on-container']}>
    <BlueBorder />
    <div className={styles['turn-on-content']}>
      <span className={styles['welcome-text']}>欢迎使用</span>
    </div>
    <BlueBorder />
  </div>;

export default function TurnOn () {
  const [timer, setTimer] = useState<number | undefined>(0);

  useEffect(() => {
    const id: number = setTimeout(() => {
      clearTimeout(timer);
      setTimer(undefined);
    }, 3000);

    setTimer(id);
  }, []);

  return timer ? <TurnOnInterface /> : null;
}
