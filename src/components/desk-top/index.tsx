import React, { useState } from 'react';
import Directory from '../directory';
import Modal from '../modal';

import * as styles from './index.module.scss';

export default function DeskTop () {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');

  const onOpenDirectory = (_title: string) => {
    setVisible(true);
    setTitle(_title);
  };

  return <>
    <section className={`${styles.deskTop} ${styles.background}`}>
      <Directory name='WebGL基础' onOpenDirectory={onOpenDirectory} />
    </section>
    <Modal
      visible={visible}
      title={title}
      onClose={() => {
        setVisible(false);
      }}
    />
  </>;
}
