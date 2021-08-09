import React from 'react'
import SBSong from "./SBSong";

const SearchBarSongs = ({songs, docRef}) => {
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
          duration={song.duration}
          docRef={docRef}
        />
      ))}
    </>
    )
}

export default SearchBarSongs
