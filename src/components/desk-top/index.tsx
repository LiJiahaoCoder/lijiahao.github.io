import React from 'react';
import Directory from '~/components/directory';

import styles from './index.scss';

export default function DeskTop () {
  return <section className={styles['desk-top']}>
    <Directory name='WebGL基础' />
  </section>;
}
