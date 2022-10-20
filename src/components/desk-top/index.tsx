import React, { useState } from 'react';
import Directory from '~/components/directory';
import Modal from '~/components/modal';

import styles from './index.scss';

export default function DeskTop () {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');

  const onOpenDirectory = (_title: string) => {
    setVisible(true);
    setTitle(_title);
  };

  const onCloseDirectory = () => {
    setVisible(false);
  };

  return <>
    <section className={`${styles.deskTop} ${styles.background}`}>
      <Directory name='WebGL基础' onOpenDirectory={onOpenDirectory} />
    </section>
    <Modal visible={visible} title={title} onClose={onCloseDirectory} />
  </>;
}
