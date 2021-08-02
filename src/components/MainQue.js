import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/ZevsStyles.scss';
import firebase from './firesbase';
import { WEB_URL } from './Home';
import Button from './Button';
import QueID from './QueID';
import InQue from './InQue';
const TEST_HASH = '0001';
const HASH_LENGTH = 4;
export { HASH_LENGTH };
const db = firebase.firestore();
const hash = makeHash(HASH_LENGTH);
const docRef = db.collection('Active Ques').doc(TEST_HASH);
const USER_ID_ENDPOINT = 'https://api.spotify.com/v1/me';

function MainQue() {
  const [songs, setSongs] = useState([
    { id: '123kf21', title: 'Piano Man', artist: 'Billy Joel' },
    { id: '198213da', title: "She's Always A Woman", artist: 'Billy Joel' },
  ]);
  const [token, setToken] = useState('');
  useEffect(() => {
    hashToDB(hash);
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
      window.history.pushState({}, document.title, '/');
      localStorage.clear();
      localStorage.setItem('token', access_token);
      setToken(localStorage.getItem('token'));
      localStorage.setItem('expiresIn', expires_in);
      localStorage.setItem('tokenType', token_type);
      getUserID(access_token);
    }
  }, []);

  const refresh = () => {
    const playlistID = localStorage.getItem('playlistID');
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setSongs((songs) => (songs = doc.data().songs));
          addSongsToPlaylist(playlistID, doc.data().songs);
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  };
  async function addSongsToPlaylist(playlistID, songsObj) {
    let uriArray = [];
    for (let i = 0; i < songsObj.length; i++) {
      uriArray.push(songsObj[i].id);
    }
    const ADD_TO_PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks';
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: uriArray }),
    };
    await fetch(ADD_TO_PLAYLIST_ENDPOINT, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  async function getUserID(token) {
    await axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        QueuePlaylist(response.data.id, token);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function QueuePlaylist(userID, token) {
    const PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/users/' + userID + '/playlists';
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Communal Que',
        description:
          'This playlist is autimatically created by Communal Que. Please do not delete during a que session. It will autimatically delete once the que is finished',
        public: true,
      }),
    };
    fetch(PLAYLIST_ENDPOINT, requestOptions)
      .then((response) => response.json())
      .then((data) => idToFirebase(data.id));
  }
  function idToFirebase(playlistid) {
    localStorage.setItem('playlistID', playlistid);
    db.collection('Active Ques')
      .doc(TEST_HASH)
      .update({
        playlistID: playlistid,
      })
      .then((docRef) => {
        console.log('Added playlist ID: ' + playlistid);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }
  return (
    <div
      className="bg"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div className="darkContainer">
        <p className="queueTitle" style={{ marginLeft: 35, marginRight: 10 }}>
          My Queue
        </p>
        <p className="queueID">ID: {hash}</p>
        <div style={{ margin: 20 }}>
          <Button text="End Queue" onClick={endQue} />
        </div>
      </div>
      <div
        className="darkContainer"
        style={{ padding: 30, flexDirection: 'column', alignItems: 'stretch' }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexGrow: 2,
            justifyContent: 'space-between',
          }}
        >
          <p className="queueTitle" style={{ fontSize: 30, color: 'gray' }}>
            Songs
          </p>
          <Button text="Refresh" onClick={refresh} />
        </div>
        <InQue songs={songs} />
      </div>
      <p className="credits">Created by Adam Cohen and Zev Ross</p>
    </div>
  );
}
const endQue = () => {
  // migrate data to past ques collection
  // go to home page
  window.location.href = WEB_URL + '/home';
};

function hashToDB(hash) {
  db.collection('Active Ques')
    .doc(hash)
    .set({
      Songs: [],
    })
    .then((docRef) => {
      console.log('Document with hash ' + hash + ' written sucesfully');
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
}
function makeHash(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split('&');
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split('=');
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

export default MainQue;
