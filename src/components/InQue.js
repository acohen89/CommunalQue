import React from 'react';
import SongInQue from './SongInQue';

const InQue = ({ songs }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <SongInQue songs={songs} />
    </div>
  );
};

export default InQue;
