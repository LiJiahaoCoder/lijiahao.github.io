import React, { useEffect, useState } from 'react';
import { Reload } from '~/assets/icons';
import styles from './index.scss';

interface IProps {
  hidden: boolean;
}

export default function WindowsPanel ({ hidden }: IProps) {
  const [panelClassname, setPanelClassname] = useState(styles['windows-panel-container']);

  const handleReload = () => {
    location.reload();
  };

  useEffect(() => {
    const hiddenClassname = hidden ? styles.hidden : '';
    setPanelClassname(
      [
        styles['windows-panel-container'],
        hiddenClassname,
      ].join(' '),
    );
  }, [hidden]);

  return <div className={panelClassname}>
    <section
      className={styles['panel-item']}
      onClick={handleReload}
     >
      <img className={styles['panel-item-icon']} src={Reload} />
      <span className={styles['panel-item-text']}>刷新</span>
    </section>
  </div>;
}
