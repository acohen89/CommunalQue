import React from 'react';
import Song from "./Song";
import './styles/ZevsStyles.scss';

const SongInQue = ({songs, inQueue }) => {
  return (
    <>
      {songs.map((song) => (
               <Song uri={song.uri} title={song.title} artist={song.artist} inQueue={inQueue} />
      ))}
    </>
  );
};

SongInQue.defaultProps = {
  name: 'TestName',
  artist: 'Test Artist',
};
export default SongInQue;