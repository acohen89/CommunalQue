import React from 'react'
import { removeSong, convert } from "./Song";

const MQSong = ({uri, title, artist, played, duration, addedBy}) => {
    let artistKey = uri + artist;
    if (uri === 'testURi') {
      uri = 'Random uri ' + Math.floor(Math.random() * 99999);
      artistKey = uri + Math.floor(Math.random() * 999);
    }
    if (played || played === undefined) {
      return <></>;
    }else{
        return (
            <div style={{ display: 'flex' }}>
            <p className="song" key={uri}>
              {' '}
              {title}
            </p>
            <p className="songArtist" key={artistKey}>
              {' '}
              {artist}
            </p>
            <p style={{ color: 'white' }}>{convert(duration)}</p>
          </div>
        )
    }
}

export default MQSong
