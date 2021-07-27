import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles/MainQue.css';
import firebase from "./firesbase";
import {WEB_URL} from "./Home";
import Button from "./Button";
import QueID from "./QueID";
import InQue from './InQue';
//import QuePlaylist from "./QuePlaylist";
const TEST_HASH = "0001";
const db = firebase.firestore();
const hash = getHash(6);
const docRef = db.collection("Active Ques").doc(TEST_HASH);

const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";

 function MainQue() {
  const [songs, setSongs] = useState([{id: "123kf21", title: "Piano Man", artist: "Billy Joel"}, 
  {id: "198213da", title: "She's Always A Woman", artist: "Billy Joel"}]);
  const [token, setToken] = useState("");
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
      getReturnedParamsFromSpotifyAuth(window.location.hash);
      window.history.pushState({}, document.title, "/");
      localStorage.clear();
      if (localStorage.getItem("accessToken")) {
        setToken(localStorage.getItem("accessToken"));
        localStorage.setItem("accessToken", access_token)
        localStorage.setItem("expiresIn", expires_in)
        localStorage.setItem("tokenType", token_type)
      }
      getUserID(access_token);
    }
  }, []);
  
  
  
  
  async function getUserID(token){
   await axios.get(USER_ID_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      QuePlaylist(response.data.id, token)
    })
    .catch((error) => {
      console.log(error);
    });
  }
  function QuePlaylist(userID, token){
    const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/users/' + userID  + "/playlists";
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': "Bearer " + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({name: "Communal Que", description: "This playlist is autimatically created by Communal Que. Please do not delete during a que session. It will autimatically delete once the que is finished", public: true })
  };
  fetch(PLAYLIST_ENDPOINT, requestOptions)
      .then(response => response.json())
      .then(data => (
        
        console.log(data)));

    }
  const refresh = () => {
    docRef.get().then((doc) => {
      if (doc.exists) {
        setSongs(songs => (songs = doc.data().songs))
      } else { console.log("No such document!");}
      }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    
    return paramsSplitUp;
  };
    
    return (
      
      <>
    <h>
      useEffect(() => {
        <QueID hash = {hash} />
      }, [])
       <Button text="End Que" onClick={endQue} />
    </h>
      <InQue songs = {songs}/>
      <Button text="Refresh" onClick={refresh}/> 
    </>
  );
}
const endQue = () => {
  // migrate data to past ques collection 
  // go to home page
  window.location.href = WEB_URL;
  
}

function getHash(){
  const hash = makeHash(6);
  db.collection("Active Ques").doc(hash).set({
    Songs: []
  })
  .then((docRef) => {
    console.log("Document written sucesfully");
    return hash;
    
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    return hash;
  });
  return hash;
  
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