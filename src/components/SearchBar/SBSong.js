import React from 'react'
import { MdAdd } from 'react-icons/md';
import { addSong } from '../Song';

const SBSong = ({uri, title, artist, duration, docRef}) => {
    let artistKey = uri + artist;
    if (uri === 'testURi') {
      uri = 'Random uri ' + Math.floor(Math.random() * 99999);
      artistKey = uri + Math.floor(Math.random() * 999);
    }
    return (
        <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex' }}>
          <p className="song" key={uri} style={{ fontSize: 15, margin: 5 }}>
            {' '}
            {title}
          </p>
          <p
            className="songArtist"
            key={artistKey}
            style={{ fontSize: 15, margin: 5 }}
          >
            {' '}
            {artist}
          </p>
        </div>
        <p style={{ color: 'white', marginLeft: 5, cursor: 'pointer'}}>
          <MdAdd onClick={ () => addSong(artist, title, uri, duration, docRef)} />
        </p>
      </div>
    )
}
SBSong.defaultProps = {
    uri: 'testURi',
    name: 'TestName',
    artist: 'Test Artist',
    inQueue: true,
    duration: 0,
    played: false,
  };

export default SBSong
