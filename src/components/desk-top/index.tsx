import React, { useState } from 'react';
import articles from '../../articles';
import { TitleKey } from '../../typings/articles';
import Directory from '../directory';
import Files from '../files';
import Markdown from '../markdown';
import Modal from '../modal';

import * as styles from './index.module.scss';

export default function DeskTop () {
  const [directoryModalVisible, setDirectoryModalVisible] = useState(false);
  const [directoryModalTitle, setDirectoryModalTitle] = useState<TitleKey>('WebGL基础');
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [fileModalTitle, setFileModalTitle] = useState('');

  const handleOpenDirectory = (title: TitleKey) => {
    setDirectoryModalVisible(true);
    setDirectoryModalTitle(title);
  };

  const handleOpenFile = (title: string) => {
    setFileModalTitle(title);
    setFileModalVisible(true);
  };

  return <>
    <section className={`${styles.deskTop} ${styles.background}`}>
      <Directory name='WebGL基础' onOpenDirectory={handleOpenDirectory} />
      <Directory name='ThreeJS' onOpenDirectory={handleOpenDirectory} />
      <Directory name='技术闲谈' onOpenDirectory={handleOpenDirectory} />
    </section>
    <Modal
      visible={directoryModalVisible}
      title={directoryModalTitle}
      onClose={() => {
        setDirectoryModalVisible(false);
      }}
    >
      <Files
        files={ articles[directoryModalTitle] }
        onOpenFile={ handleOpenFile }
      />
    </Modal>
    <Modal
      visible={fileModalVisible}
      title={fileModalTitle}
      onClose={() => {
        setFileModalVisible(false);
      }}
    >
      <Markdown
        children={articles[
          directoryModalTitle
        ].find(
          ({ title }) => title === fileModalTitle,
          )?.content ?? '空'
        }
      />
    </Modal>
  </>;
}
