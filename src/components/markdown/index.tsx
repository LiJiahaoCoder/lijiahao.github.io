import React from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './index.module.scss';

interface IProps {
  children: string;
}

export default function Markdown ({ children }: IProps) {
  return (
    <ReactMarkdown className={styles.markdown} children={children} />
  );
}
