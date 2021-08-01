import React from 'react';
import Song from "./Song";
import "./styles/SongInQue.css";


const SongInQue = ({songs, inQueue}) => {
    return (
        <>
            {songs.map((song) => (
               <Song uri={song.uri} title={song.title} artist={song.artist} inQueue={inQueue} />
                // <p key = {song.uri} style={{cursor:"pointer"}} onClick={console.log()}> {song.title} {song.artist} </p>
            ))}     
        </>
    )
}


export default SongInQue;
