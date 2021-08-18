import React from 'react';
import MQSong from './MQSong';

const MainQueueSongs = ({ songs, docRef }) => {
  function processKey(id) {
    return id === 'testURi' || id === undefined || id === ''
      ? 'Random URI' + Math.floor(Math.random() * 999999999)
      : id;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <>
        {songs.map((song) => (
          <MQSong
            uri={processKey(song.id)}
            title={song.title}
            artist={song.artist}
            coverImage={song.coverImage}
            played={song.played}
            duration={song.duration}
            addedBy={song.addedBy}
            docRef={docRef}
          />
        ))}
      </>
    </div>
  );
};
MainQueueSongs.defaultProps = {
  name: 'TestName',
  artist: 'Test Artist',
  uri: 'testURi',
};

export default MainQueueSongs;
