import React from 'react';
import './styles/ZevsStyles.scss';

const SongInQue = ({ songs }) => {
  return (
    <>
      {songs.map((song) => (
        <div style={{ display: 'flex' }}>
          <p className="song" key={song.id}>
            {' '}
            {song.title}
          </p>
          <p className="songArtist" key={song.id}>
            {' '}
            {song.artist}
          </p>
        </div>
      ))}
    </>
  );
};

SongInQue.defaultProps = {
  name: 'TestName',
  artist: 'Test Artist',
};
export default SongInQue;