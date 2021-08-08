import React from 'react';
import { MdAdd } from 'react-icons/md';
import { GrFormAdd } from 'react-icons/gr';
import firebase from './firesbase';
const db = firebase.firestore();

const Song = ({ uri, title, artist, inQueue, played, duration }) => {
  // URI IS WRONG
  //console.log(uri, title, artist,)

  console.log('Duration: ' + duration);
  function convert(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
  const queueID = localStorage.getItem('queueID');
  const docRef = db.collection('Active Ques').doc(queueID);
  const addSong = () => {
    console.log('Song being added');
    if (artist === '' || title === '' || uri === '') {
      console.error("Can't add an empty song");
      return;
    }
    docRef
      .update({
        songs: firebase.firestore.FieldValue.arrayUnion({
          artist: artist,
          id: uri,
          title: title,
          played: false,
        }),
      })
      .then(() => {
        console.log('Added ' + title + ' to database!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };
  let artistKey = uri + artist;
  if (uri === 'testURi') {
    uri = 'Random uri ' + Math.floor(Math.random() * 99999);
    artistKey = uri + Math.floor(Math.random() * 999);
  }
  if (played || played === undefined) {
    return <></>;
  } else if (!inQueue) {
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
        <p
          onClick={addSong}
          style={{ color: 'white', marginLeft: 5, cursor: 'pointer' }}
        >
          <MdAdd />
        </p>
      </div>
    );
  } else {
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
    );
  }
};
Song.defaultProps = {
  uri: 'testURi',
  name: 'TestName',
  artist: 'Test Artist',
  inQueue: true,
  played: false,
};

export default Song;
