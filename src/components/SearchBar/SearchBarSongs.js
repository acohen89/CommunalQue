import React from 'react'
import SBSong from "./SBSong";

const SearchBarSongs = ({songs}) => {
    function processKey(id) {
        return id === 'testURi' || id === undefined || id === ''
          ? 'Random URI' + Math.floor(Math.random() * 999999999)
          : id;
      }
    return (
        <>
      {songs.map((song) => (
        <SBSong
          uri={processKey(song.uri)}
          title={song.title}
          artist={song.artist}
          duration={218905}
        />
      ))}
    </>
    )
}

export default SearchBarSongs
