import React, { useEffect, useState } from 'react';
import { ALERT_MESSAGE } from '../NowPlaying';
import { refreshAccessToken } from '../Home';
import axios from 'axios';
import '../styles/ZevsStyles.scss';
import firebase from '../firesbase';
import { WEB_URL } from '../Home';
import Button from '../Button';
import NowPlaying, {
  getNowPlaying,
  disableShuffleandRepeat,
  skipTrack,
  previousTrack,
  play,
  pause,
} from '../NowPlaying';
import MainQueueSongs from './MainQueueSongs';
import SearchBar from '../SearchBar/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PLAYLIST_NAME = 'Communal Queue';
const PLAYLIST_DESCRIPTION =
  'This playlist is automatically created by Communal Queue. Please do not delete during a que session.';
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const HASH_LENGTH = 7;
export { HASH_LENGTH };
const db = firebase.firestore();
const USER_ID_ENDPOINT = 'https://api.spotify.com/v1/me';
const PLAYBACK_ENDPOINT = 'https://api.spotify.com/v1/me/player/play';
if (!localStorage.getItem('hash')) {
  localStorage.setItem('hash', makeHash(HASH_LENGTH));
}
const hash = localStorage.getItem('hash');
const docRef = db.collection('Active Ques').doc(hash);


function MainQue() {
  const [songs, setSongs] = useState([
    {
      id: '123kf21',
      title: '',
      artist: 'No songs in queue currently',
      played: false,
      duration: "",
      coverImage: null,
    },
  ]);
  
  const [curSong, setCurSong] = useState({
    id: '2',
    title: '',
    artist: '',
    inQueue: true,
    addedBy: 'Spotify',
    duration: 0,
  });

  var docExists = false;
  const token = localStorage.getItem('token');
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        docExists = true;
      } else {
        docExists = false;
        console.log('No such document!');
      }
    })
    .catch((error) => {
      docExists = false;
      console.log('Error getting document:', error);
    });
  
  
  if(docExists) {updateNowPlaying();} 
  useEffect(() => {
    getNameFromSpot();
    docRef.onSnapshot((doc) => {
      refresh();
    });
  }, []);
  
  useEffect(() => {
    setInterval(() => updateNowPlaying(), 5500);
  }, []);
  
  async function updateNowPlaying() {

    (async () => {
      const cSong = await getNowPlaying();
      if (cSong.title !== curSong.title) {        
        if (
          cSong.addedBy === 'Spotify' ||
          cSong.addedBy === null ||
          cSong.addedBy === undefined
          ) {
          let addedBy = await getAddedByFromDB(cSong);
          if ((addedBy !== null || addedBy !== undefined) && cSong.addedBy) {
            cSong.addedBy = addedBy;
          }
        }
        // TODO: change state of play pause button to a play icon if a new song is playing
        setCurSong((curSong) => (curSong = cSong));
      }
    })();
  }
  async function getAddedByFromDB(curSong) {
    let ret = null;
    await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if(doc.data().songs !== undefined){
          for (let i = 0; i < doc.data().songs.length; i++) {
            if (doc.data().songs[i].id === curSong.uri) {
              ret = doc.data().songs[i].addedBy;
            }
          }
        }
      } else {
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
    return ret;
  }
  
  function getNameFromSpot() {
    const token = localStorage.getItem('token');
    axios
    .get(USER_ID_ENDPOINT, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((response) => {
      localStorage.setItem('name', response.data.display_name);
    })
    .catch((error) => {
      console.log(error + '\n with token \n ' + token);
    });
  }
  
  useEffect(() => {
    hashToDB(hash);
    getUserID(token);
  }, []);
  
  const playlistIDProm = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (localStorage.getItem('playlistID') !== null) {
        resolve('playistID');
      }
    }, 2200);
  });
  playlistIDProm.then(
    useEffect(() => {
      docRef.onSnapshot((doc) => {
        console.log('New Data!');
        // refresh();
      });
      playPlaylist();
      setInterval(changeCurrentSongToPlayed, 4500);
    }, [])
    );
   
    function playPlaylist() {
      const playlistURI =
      'spotify:playlist:' + localStorage.getItem('playlistID');
      const requestOptions = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: playlistURI,
        offset: {
          position: 0,
        },
        position_ms: 0,
      }),
    };
    fetch(PLAYBACK_ENDPOINT, requestOptions)
    .then(
      (response) =>
      function () {
            if (response.status !== undefined) {
              if (response.status === 401) {
                refreshAccessToken();
              }
            } else if (
              response.status === 404 &&
              !localStorage.getItem('noActiveDevice')
              ) {
                localStorage.setItem('noActiveDevice', true);
                notify(ALERT_MESSAGE, 6000);
              } else {
                localStorage.setItem('noActiveDevice', false);
              }
            }
            )
            .then(function () {
              if (!localStorage.getItem('noActiveDevice')) {
                disableShuffleandRepeat();
              } else {
                localStorage.setItem('noActiveDevice', true);
                notify(ALERT_MESSAGE, 6000);
              }
            })
            .then(changeCurrentSongToPlayed());
          }
          async function changeCurrentSongToPlayed() {
            (async () => {
              const nowPlaying = await getNowPlaying();
              const dbSongs = await getSongsFromDB();
              if(dbSongs !== undefined){
                for (let i = 0; i < dbSongs.length; i++) {
                  if (nowPlaying.uri === dbSongs[i].id && !dbSongs[i].played) {
                    updateDB(dbSongs, nowPlaying);
                  }
                }
              }
            })();
          }
          function updateDB(dbSongs, songToUpdate) {
    console.log('in update');
    let newSongs = dbSongs;
    for (let i = 0; i < newSongs.length; i++) {
      if (newSongs[i].id === songToUpdate.uri) {
        console.log('Changing ' + newSongs[i].title + ' to played ');
        newSongs[i].played = true;
      }
    }
    docRef.update({
      songs: newSongs,
    });
  }
  function removeSongFromPlaylist(playlistID, song) {
    const RM_ENDPOINT =
    'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks';
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: [{ uri: song.uri }],
      }),
    };
    fetch(RM_ENDPOINT, requestOptions).then((data) => {
      if (data.status !== undefined) {
        if (data.status === 401) {
          refreshAccessToken();
        }
        console.log('Removed ' + song.title + ' from playlist');
      }
    });
  }
  const refresh = () => {
    const playlistID = localStorage.getItem('playlistID');
    docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        if(doc.data().songs !== undefined ){
          setSongs((songs) => (songs = doc.data().songs));
          addSongsToPlaylist(playlistID, doc.data().songs);
        }
      } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
    };
    async function addSongsToPlaylist(playlistID, songsObj) {
      const SPECIFIC_PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/playlists/' + playlistID;
      await axios
      .get(SPECIFIC_PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        addUniqueSongs(playlistID, songsObj, response.data.tracks.items);
      })
      .catch((error) => {
        if (error.response.status !== undefined) {
            if (error.response.status === 401) {
            refreshAccessToken();
          }
        }
        console.log(error + ' with getting songs in playlist');
      });
    }
    async function addUniqueSongs(playlistID, songsObj, songsAlreadyInPlaylist) {
      let uriAndTitleArray = findUniqueSongs(songsObj, songsAlreadyInPlaylist);
      const uriArray = uriAndTitleArray[0];
      const titleArray = uriAndTitleArray[1];
      if (uriArray.length !== 0) {
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
        await fetch(ADD_TO_PLAYLIST_ENDPOINT, requestOptions).then((data) => {
          if (data.status !== undefined) {
            if (data.status === 401) {
              refreshAccessToken();
            }
          }
          console.log('Added songs: ' + printArr(titleArray) + 'to playlist');
        });
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
        if (error.response.status !== undefined) {
          if (error.response.status === 401) {
            refreshAccessToken();
          }
        }
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
          if (response.data.items[i].name === "Communal Queue") {
              found = true;
              clearPlaylist(response.data.items[i].id);
              idToFirebase(response.data.items[i].id, false);
              break;
            }
          }
        if (!found) {
          console.log("Creating new")
          createNewPlaylist(userID, token);
        }
      })
      .catch((error) => {
        if (error.response.status !== undefined) {
          if (error.response.status === 401) {
            refreshAccessToken();
          }
        }
        console.log(error);
      });
    }
    function createNewPlaylist(userID, token) {
      const PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/users/' + userID + '/playlists';
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: "application/json",
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: PLAYLIST_NAME,
          description: PLAYLIST_DESCRIPTION,
        public: true,
      }),
    };
    fetch(PLAYLIST_ENDPOINT, requestOptions).
    then(response => response.json())
    .then((data) => {
      if (data.status !== undefined) {
        if (data.status === 401) {
          refreshAccessToken();
        }
      }
      idToFirebase(data.id, true);
    });
  }
  function clearPlaylist(id){
    const SPECIFIC_PLAYLIST_ENDPOINT =
      'https://api.spotify.com/v1/playlists/' + id;
      axios
      .get(SPECIFIC_PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((response) => {
        removeAll(response.data.tracks.items, id);
      })
      .catch((error) => {
        if (error.response !== undefined) {
            if (error.response.status === 401) {
            refreshAccessToken();
          }
        }
        console.log(error + ' with getting songs in playlist');
      });
  }
  function removeAll(songs, id){
    let songsToRemove = [];
    for(let i = 0; i < songs.length; i++){
      songsToRemove.push({uri: songs[i].track.uri})
    }
    const RM_ENDPOINT =
    'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: songsToRemove,
      }),
    };
    fetch(RM_ENDPOINT, requestOptions).then((data) => {
      if (data.status !== undefined) {
        if (data.status === 401) {
          refreshAccessToken();
        }
      }
    });
  }
  function idToFirebase(playlistid, newPlaylist) {
    localStorage.setItem('playlistID', playlistid);
    if(playlistid !== undefined){
      db.collection('Active Ques')
      .doc(hash)
      .set({
        playlistID: playlistid,
      })
      .then((docRef) => {
        console.log(
          newPlaylist
          ? 'Added a new playlist with id ' + playlistid
          : 'Added old playlist with id ' + playlistid
          );
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    } else {
      console.error("playlist id undefined")
    }
  }
    const endQue = () => {
      // migrate data to past ques collection
      // go to home page
      localStorage.removeItem('hash');
      localStorage.removeItem('noActiveDevice');
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
      <div style={{ position: 'absolute', margin: 30, top: 0, right: 0 }}>
        <SearchBar docRef={docRef} />
      </div>
      <div className="darkContainer">
        <p className="queueTitle" style={{ marginLeft: 35, marginRight: 10 }}>
          My Queue
        </p>
        <p className="queueID" style={{ color: 'gray' }}>
          ID: {hash}
        </p>
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
        </div>
        <NowPlaying curSong={curSong} />
        <MainQueueSongs songs={songs} docRef={docRef} />
      </div>
      <p className="credits">Created by Adam Cohen and Zev Ross</p>
      <ToastContainer />
    </div>
  );
}


function findUniqueSongs(songsObj, songsAlreadyInPlaylist) {

  let uriArray = [];
  let titleArray = [];
  for (let i = 0; i < songsObj.length; i++) {
    let inPlaylistAlready = false;
    for (let j = 0; j < songsAlreadyInPlaylist.length; j++) {
      if (songsObj[i].id === songsAlreadyInPlaylist[j].track.uri) {
        inPlaylistAlready = true;
        break;
      }
    }
    if (!inPlaylistAlready) {
      uriArray.push(songsObj[i].id);
      titleArray.unshift(songsObj[i].title);
    }
  }
  return [uriArray, titleArray];
}
function printArr(arr) {
  let ret = '\n';
  for (let i = 0; i < arr.length; i++) {
    ret += arr[i] + '\n';
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
export const notify = (message, milliseconds) =>
toast(message, { autoClose: milliseconds });
export async function getSongsFromDB() {
let data = '';
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