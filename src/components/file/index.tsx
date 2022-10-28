import React, { MouseEvent as ReactMouseEvent } from 'react';
import { FileIcon } from '../../assets/icons';

import * as styles from './index.module.scss';

interface IProps {
  name: string;
  onOpenFile: (name: string) => void;
}

export default function File ({ name, onOpenFile }: IProps) {
  const handleClick = (e: ReactMouseEvent) => {
    e.stopPropagation();
  };

  const handleDoubleClick = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onOpenFile(name);
  };

  return <div className={styles.file}>
    <img
      className={styles.icon}
      title={name}
      src={FileIcon}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
    <span className={styles.title} title={name}>{ name }</span>
  </div>;
}
