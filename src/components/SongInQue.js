import React from 'react';
import Song from "./Song";

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
  uri: "testUri",
};
export default SongInQue;