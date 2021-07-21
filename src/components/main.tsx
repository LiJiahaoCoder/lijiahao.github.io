import React, { useMemo, useState } from 'react';
import ctx from '~/context';
import DeskTop from './desk-top';
import TaskBar from './task-bar';

export default function Main () {
  const [directories, setDirectories] = useState({});

  const injected = useMemo(
    () => ({ directories, setDirectories }),
    [directories],
  );

  return <ctx.Provider value={injected}>
    <DeskTop />
    <TaskBar />
  </ctx.Provider>;
}
