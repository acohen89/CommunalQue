import React from 'react';
import { MdAdd } from 'react-icons/md';
import { getSongsFromDB } from './MainQueue/MainQue';
import { GrFormAdd } from 'react-icons/gr';
import firebase from './firesbase';
const db = firebase.firestore();

const Song = ({ uri, title, artist, inQueue, played, duration }) => {
  const queueID = localStorage.getItem('queueID');
  const docRef = db.collection('Active Ques').doc(queueID);
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
export const addSong = (artist, title, uri, duration, coverImage, docRef) => {
    const name = localStorage.getItem("name") === null || localStorage.getItem("name") === undefined ? "N/A" : localStorage.getItem("name");
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
          duration: duration,
          played: false,
          coverImage: coverImage,
          addedBy: name
        }),
      })
      .then(() => {
        console.log('Added ' + title + ' to database!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };
export function convert(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? minutes + 1 + ':00'
      : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
  docRef
    .update({
      songs: firebase.firestore.FieldValue.arrayUnion({
        artist: artist,
        id: uri,
        title: title,
        played: false,
        addedBy: name,
      }),
    })
    .then(() => {
      console.log('Added ' + title + ' to database!');
    })
    .catch((error) => {
      console.error('Error updating document: ', error);
    });
};
export function convert(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds === 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
export async function removeSong(uri, docRef) {
  const playlistID = localStorage.getItem('playlistID');
  const token = localStorage.getItem('token');
  if (playlistID === null || playlistID === undefined) {
    console.error('Playist id = ' + playlistID);
    return;
  }
  if (uri.substring(0, 7) !== 'spotify') {
    console.error('Invalid uri of ' + uri);
    return;
  }
  if (token === null || token === undefined) {
    console.error('Invalid token of ' + token);
    return;
  }
  const RM_PLAYLIST_ENDPOINT =
    'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks';
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  };
  fetch(RM_PLAYLIST_ENDPOINT, requestOptions).then(
    (response) =>
      function () {
        console.log(response);
      }
  );
  const dbSongs = await getSongsFromDB();
  let newSongs = [];
  for (let i = 0; i < dbSongs.length; i++) {
    if (dbSongs[i].id !== uri) {
      newSongs.push(dbSongs[i]);
    } else {
      console.log('Deleted song:  ' + dbSongs[i].title + ' from db');
    }
  }
  docRef.update({
    songs: newSongs,
  });
}
Song.defaultProps = {
  uri: 'testURi',
  name: 'TestName',
  artist: 'Test Artist',
  inQueue: true,
  duration: 0,
  played: false,
};

export default Song;
