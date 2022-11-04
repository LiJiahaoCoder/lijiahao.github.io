import React from 'react';
import { IFile } from '../../typings/articles';
import File from '../file';

import styles from './index.module.scss';

interface IProps {
  files: IFile[];
  onOpenFile: (name: string) => void;
}

export default function Files ({ files, onOpenFile }: IProps) {
  return <section className={styles.filesWrapper}>
    {
      files.map(({ title }) => (
        <File
          key={ title }
          name={ title }
          onOpenFile={ onOpenFile }
        />
      ))
    }
  </section>;
}
