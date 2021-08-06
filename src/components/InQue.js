import React from 'react';
import SongInQue from './SongInQue';

const InQue = ({ songs, inQueue }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <SongInQue songs={songs} inQueue={inQueue} />
    </div>
  );
};
export default InQue;
