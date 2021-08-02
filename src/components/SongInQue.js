import React from 'react';
import Song from "./Song";

const SongInQue = ({songs, inQueue }) => {
  return (
    <>
      {songs.map((song) => (
               <Song key = {song.uri === "testURi"  || song.uri === undefined || song.uri === "" ? "testURi" + Math.floor(Math.random() * 999) : song.uri} uri={song.uri} title={song.title} artist={song.artist} inQueue={inQueue} />
      ))}
    </>
  );
};

SongInQue.defaultProps = {
  name: 'TestName',
  artist: 'Test Artist',
  uri: "testURi",
};
export default SongInQue;