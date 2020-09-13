import React from 'react';
import Background from './background';
import DeskTop from './desk-top';
import TaskBar from './task-bar';

export default function Main () {
  return <>
    <Background />
    <DeskTop />
    <TaskBar />
  </>;
}
