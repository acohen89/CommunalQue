import React, { useEffect, useState } from 'react';
import {ALERT_MESSAGE} from "../NowPlaying";
import { refreshAccessToken } from '../Home';
import axios from 'axios';
import '../styles/ZevsStyles.scss';
import firebase from '../firesbase';
import { WEB_URL } from '../Home';
import Button from '../Button';
import NowPlaying, {getNowPlaying, disableShuffleandRepeat, skipTrack, previousTrack, play, pause} from "../NowPlaying";
import MainQueueSongs from './MainQueueSongs';
const TEST_HASH = '0001';
const PLAYLIST_NAME = 'Communal Queue';
const PLAYLIST_DESCRIPTION =
  'This playlist is automatically created by Communal Queue. Please do not delete during a que session.';
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const HASH_LENGTH = 4;
export { HASH_LENGTH };
const db = firebase.firestore();
const docRef = db.collection('Active Ques').doc(TEST_HASH);
const USER_ID_ENDPOINT = 'https://api.spotify.com/v1/me';
const PLAYBACK_ENDPOINT = "https://api.spotify.com/v1/me/player/play";

// TODO: add state for now playing and pass in new song when needed
// TODO: add description for app on homepage
// TODO: add refresh token methods
// TODO: don't update db for idToFirebase and hashToDB when page is re rendered or refreshed only on frist load. just add a bool in local storage
// TODO: add custom image for queue playlist
// TODO: have an existing que button which checks if there is a hash in local storage (a check for a active que) ending the que would simply delete this

// if song is already played, set a value in the db to true
// have song component only display songs with this value of false

function MainQue() {
  if(!localStorage.getItem("hash")){
    localStorage.setItem("hash", makeHash(HASH_LENGTH));
  }
  const hash = localStorage.getItem("hash");
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([
    { id: '123kf21', title: 'Piano Man', artist: 'Billy Joel', played: false, duration: 0, coverImage: null },
    { id: '198213da', title: "She's Always A Woman", artist: 'Billy Joel', played: false, duration: 0, coverImage: null },
  ]);  
  useEffect(() => {
    hashToDB(hash);
    getUserID(token);
  }, []) 
  

  const playlistIDProm = new Promise((resolve, reject) => {
    setTimeout(() => {
      if(localStorage.getItem("playlistID") !== null){
        console.log("Resolved promise")
        resolve("playistID");
      }
    }, 2200);
  });
  playlistIDProm.then(
  useEffect(() => {
    docRef.onSnapshot((doc) => {
      console.log("New Data!")
      refresh();
    });
    playPlaylist();
    setInterval(changeCurrentSongToPlayed, 4500);
  }, [])) 


  function playPlaylist(){
      const playlistURI = "spotify:playlist:" + localStorage.getItem("playlistID");
      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          { "context_uri": playlistURI,
          "offset": {
            "position": 0
          },
          "position_ms": 0 }),
        };
      fetch(PLAYBACK_ENDPOINT, requestOptions)
      .then((response) => function () {
        if(response.status === 404 && !localStorage.getItem("noActiveDevice")){
          localStorage.setItem("noActiveDevice", true);
          alert(ALERT_MESSAGE)
        } else {
          localStorage.setItem("noActiveDevice", false)
        }
        
      })
      .then(function (){
        if(!localStorage.getItem("noActiveDevice")){
          disableShuffleandRepeat()
        } else {
          localStorage.setItem("noActiveDevice", true);
          alert(ALERT_MESSAGE);
        }
      }).then(changeCurrentSongToPlayed())
  }
  async function changeCurrentSongToPlayed(){
      ;(async () => {
        const nowPlaying = await getNowPlaying();
        const dbSongs =  await getSongsFromDB();
        for(let i = 0; i < dbSongs.length; i++){
          if(nowPlaying.uri === dbSongs[i].id && !dbSongs[i].played){
            updateDB(dbSongs, nowPlaying);
          }
        }
      })()
  }
  function updateDB(dbSongs, songToUpdate){
      console.log("in update")
      let newSongs = dbSongs;
      for(let i = 0; i < newSongs.length; i++){
        if(newSongs[i].id === songToUpdate.uri){
          console.log("Changing " + newSongs[i].title + " to played ");
          newSongs[i].played = true;
        }
      }
      docRef.update({
        songs: newSongs
      });
      
  }
  function removeSongFromPlaylist(playlistID, song){
      const RM_ENDPOINT = 	"https://api.spotify.com/v1/playlists/" + playlistID + "/tracks";
      const requestOptions = {
        method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "tracks": [{ "uri": song.uri}] 
      })
    }
    fetch(RM_ENDPOINT, requestOptions)
    .then()
      .then((data) => console.log("Removed " + song.title + " from playlist"))
      
  }
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
    const SPECIFIC_PLAYLIST_ENDPOINT = 	"https://api.spotify.com/v1/playlists/" + playlistID;
    await axios
    .get(SPECIFIC_PLAYLIST_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      addUniqueSongs(playlistID, songsObj, response.data.tracks.items);
    })
    .catch((error) => {
      console.log(error + " with getting songs in playlist");
    });
  } 
  async function addUniqueSongs(playlistID, songsObj, songsAlreadyInPlaylist){  
    let uriAndTitleArray = findUniqueSongs(songsObj, songsAlreadyInPlaylist);
    const uriArray = uriAndTitleArray[0];
    const titleArray = uriAndTitleArray[1];
    if(uriArray.length !== 0){
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
        .then((data) => console.log("Added songs: " + printArr(titleArray) + "to playlist"));
      }
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
        console.log(error + '\n with token \n ' + token);
      });
    }
    function SetUpQueuePlaylist(userID, token) {
      // checking if playlist has already been created
      axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        let found = false;
        for (let i = 0; i < response.data.items.length; i++) {
          if (
            response.data.items[i].name === PLAYLIST_NAME &&
            response.data.items[i].description === PLAYLIST_DESCRIPTION
          ) {
            found = true;
            console.log('Playlist already in library, old one being used');
            idToFirebase(response.data.items[i].id, false);
            break;
          }
        }
        if (!found) {
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
    localStorage.removeItem("hash");
    localStorage.removeItem("noActiveDevice");
    pause();
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
        style={{
          padding: 30,
          flexDirection: 'column',
          alignItems: 'stretch',
          minWidth: 700,
        }}
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
        <MainQueueSongs songs={songs}/>
      </div>
      <p className="credits">Created by Adam Cohen and Zev Ross</p>
    </div>
  );
}
function findUniqueSongs(songsObj, songsAlreadyInPlaylist){
  let uriArray = [];
  let titleArray = [];
  for (let i = 0; i < songsObj.length; i++) {
    let inPlaylistAlready = false;
    for(let j = 0; j < songsAlreadyInPlaylist.length; j++){
      if(songsObj[i].id === songsAlreadyInPlaylist[j].track.uri){
        inPlaylistAlready = true;
        break;
      }
    }
    if(!inPlaylistAlready){
      uriArray.push(songsObj[i].id);
      titleArray.unshift(songsObj[i].title);
    }
  }
  return [uriArray, titleArray];
}
function printArr(arr){
  let ret = "\n";
  for(let i = 0; i < arr.length; i++){
    ret += arr[i] + "\n";
  }
  return ret;
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
export async function getSongsFromDB(){
  let data = "";
  await docRef
  .get()
  .then((doc) => {
    if (doc.exists) {
      data = doc.data().songs;
    } else {
      console.log('No such document!');
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error);
  });
  return data;
}

export default MainQue;