import React, { useEffect, useState } from 'react';
import { Reload } from '../../assets/icons';

import styles from './index.module.scss';

interface IProps {
  hidden: boolean;
}

export default function WindowsPanel ({ hidden }: IProps) {
  const [panelClassname, setPanelClassname] = useState(styles.windowsPanelContainer);

  const handleReload = () => {
    location.reload();
  };

  useEffect(() => {
    const hiddenClassname = hidden ? styles.hidden : '';
    setPanelClassname(
      [
        styles.windowsPanelContainer,
        hiddenClassname,
      ].join(' '),
    );
  }, [hidden]);

  return <div className={panelClassname}>
    <section
      className={styles.panelItem}
      onClick={handleReload}
     >
      <img className={styles.panelItemIcon} src={Reload} />
      <span className={styles.panelItemText}>刷新</span>
    </section>
  </div>;
}
