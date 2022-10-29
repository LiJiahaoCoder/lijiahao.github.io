import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import * as styles from './index.module.scss';

interface IProps {
  children: string;
}

export default function Markdown ({ children }: IProps) {
  return (
    <ReactMarkdown
      className={styles.markdown}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      children={children}
    />
  );
}
