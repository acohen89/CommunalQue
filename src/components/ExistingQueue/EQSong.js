import React from 'react';
import { convert } from '../Song';
import { FiTrash } from 'react-icons/fi';
import { removeSong } from '../Song';

const EQSong = ({ uri, title, artist, duration, played, addedBy, docRef }) => {
  // if localStorage.getItem("name") === song.addedBy have a remove button shw up on songs in queue. if not, don't.
  let artistKey = uri + artist;
  if (uri === 'testURi') {
    uri = 'Random uri ' + Math.floor(Math.random() * 99999);
    artistKey = uri + Math.floor(Math.random() * 999);
  }
  if (played || played === undefined) {
    return <></>;
  } else {
    return (
      <div style={{ display: 'flex', width: '100%', alignItems: 'baseline' }}>
        <p className="song" key={uri}>
          {' '}
          {title}
        </p>
        <p className="songArtist" style={{ color: 'gray' }} key={artistKey}>
          {' '}
          {artist}
        </p>
        <p style={{ color: 'white' }}>{convert(duration)}</p>
        {addedBy === localStorage.getItem('name') ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexGrow: 2,
            }}
          >
            <FiTrash
              style={{ color: 'gray', marginRight: 20, cursor: 'pointer' }}
              onClick={() => removeSong(uri, docRef)}
            />
          </div>
        ) : null}
      </div>
    );
  }
};

export default EQSong;
