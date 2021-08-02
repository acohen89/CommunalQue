import React, {useEffect, useState } from "react";
import axios from "axios";
import "./styles/ZevsStyles.scss";
import firebase from "./firesbase";
import {WEB_URL} from "./Home";
import Button from "./Button";
import InQue from './InQue';
const TEST_HASH = '0001';
const PLAYLIST_NAME = "Communal Queue";
const PLAYLIST_DESCRIPTION = "This playlist is automatically created by Communal Que. Please do not delete during a que session.";
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

  const token = localStorage.getItem("token");
  useEffect(() => {
    hashToDB(hash);
    getUserID(token);
  }, [])

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
      .then((data) => console.log("Added songs to playlist"));
  }
  async function getUserID(token) {
    await axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        SetUpQueuePlaylist(response.data.id, token);
      })
      .catch((error) => {
        console.log(error + "\n with token \n " + token);
      });
  }
  function SetUpQueuePlaylist(userID, token) {
    // checking if playlist has already been created
    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        let found = false;
        for(let i = 0; i < response.data.items.length; i++){
          if(response.data.items[i].name === PLAYLIST_NAME && response.data.items[i].description === PLAYLIST_DESCRIPTION){
            found = true;
            console.log("Playlist already in library, old one being used");
            idToFirebase(response.data.items[i].id, false);
          }
        }
        if(!found){
          createNewPlaylist(userID, token);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function createNewPlaylist(userID, token ){
    const PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/users/' + userID + '/playlists';
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: PLAYLIST_NAME,
        description: PLAYLIST_DESCRIPTION,
        public: true,
      }),
    };
    fetch(PLAYLIST_ENDPOINT, requestOptions)
      .then((response) => response.json())
      .then((data) => idToFirebase(data.id, true));
  }
  
  function idToFirebase(playlistid, newPlaylist) {
    localStorage.setItem('playlistID', playlistid);
    db.collection('Active Ques')
      .doc(TEST_HASH)
      .update({
        playlistID: playlistid,
      })
      .then((docRef) => {
        console.log(newPlaylist ? "Added a new playlist with id " + playlistid : "Added old playlist with id " + playlistid);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
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


export default MainQue;
