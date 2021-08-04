import React from 'react';
import Song from "./Song";

const SongInQue = ({songs, inQueue }) => {
  function processKey(id){
    return id === "testURi"  || id === undefined || id === "" ? "Random URI" + Math.floor(Math.random() * 999999999) : id;
  }
  return (
    <>
      {songs.map((song) => (
               <Song key = {processKey(song.id)} title={song.title} artist={song.artist} inQueue={inQueue} played={song.played} />
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