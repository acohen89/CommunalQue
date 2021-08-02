import React, {useEffect, useState } from "react";
import axios from "axios";
import './styles/MainQue.css';
import firebase from "./firesbase";
import {WEB_URL} from "./Home";
import Button from "./Button";
import QueID from "./QueID"
import InQue from './InQue';
const TEST_HASH = "0001";
const HASH_LENGTH = 4;
export {HASH_LENGTH};
const db = firebase.firestore();
const hash = makeHash(HASH_LENGTH);
const docRef = db.collection("Active Ques").doc(TEST_HASH);
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";

function MainQue() {
  const [songs, setSongs] = useState([{id: "123kf21", title: "Piano Man", artist: "Billy Joel"}, 
  {id: "198213da", title: "She's Always A Woman", artist: "Billy Joel"}]);
  useEffect(() => {
    hashToDB(hash);
    getUserID(localStorage.getItem("token"));
  }, [])
  const refresh = () => {
    const playlistID = localStorage.getItem("playlistID");
    console.log(playlistID)
    docRef.get().then((doc) => {
      if (doc.exists) {
        setSongs(songs => (songs = doc.data().songs))
        addSongsToPlaylist(playlistID, doc.data().songs);
      } else { console.log("No such document!");}
      }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
  async function addSongsToPlaylist(playlistID, songsObj){
    let uriArray = [];
    for(let i = 0; i < songsObj.length; i++){
      uriArray.push(songsObj[i].id);
    }
    const ADD_TO_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks"
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': "Bearer " + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({"uris": uriArray})
    };
    console.log(token)
    await fetch(ADD_TO_PLAYLIST_ENDPOINT, requestOptions)
        .then(response => response.json())
        .then(data => (
         console.log(data)
        ))
  }
  async function getUserID(token){
    await axios.get(USER_ID_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      QueuePlaylist(response.data.id, token)
    })
    .catch((error) => {
      console.log(error);
    });
  }
  function QueuePlaylist(userID, token){
    const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/users/' + userID  + "/playlists";
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': "Bearer " + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({name: "Communal Que", description: "This playlist is autimatically created by Communal Que. Please do not delete during a que session. It will autimatically delete once the que is finished", public: true })};
    fetch(PLAYLIST_ENDPOINT, requestOptions)
        .then(response => response.json())
        .then(data => (
          idToFirebase(data.id))
        )
  }
  function idToFirebase(playlistid){
    console.log("Logging playlistID to firebase " + playlistid)
    localStorage.setItem("playlistID", playlistid);
    db.collection("Active Ques").doc(TEST_HASH).update({
      playlistID: playlistid
    })
    .then((docRef) => {
      console.log("Added playlist ID: " + playlistid);
      
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  return (
    <>
    <h1>
       <QueID hash = {hash} />
       <Button text="End Queue" onClick={endQue} />
    </h1>
      <InQue songs = {songs}/>
      <Button text="Refresh" onClick={refresh}/> 
    </>
  );
}
const endQue = () => {
  // migrate data to past ques collection 
  // go to home page
  window.location.href = WEB_URL + "/home"; 
}

function hashToDB(hash){
  db.collection("Active Ques").doc(hash).set({
    Songs: []
  })
  .then((docRef) => {
    console.log("Document with hash " + hash + " written sucesfully");
    
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });  
}
function makeHash(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export default MainQue;