import React from 'react';
import { WindowsXpDefaultWallpaper } from '~/assets/images';
import styles from './index.scss';

const style = {
  background: `no-repeat url(${WindowsXpDefaultWallpaper})`,
};

export default function Background () {
  return <div className={styles.background} style={style}></div>;
}
