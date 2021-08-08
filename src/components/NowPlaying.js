import React from 'react'
import axios from "axios";
import {refreshAccessToken} from "./Home";
const token = localStorage.getItem("token");
const CURRENTLY_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing?market=US";
const TOGGLE_REPEAT_ENDPOINT = "https://api.spotify.com/v1/me/player/repeat?state=off";
const TOGGLE_SHUFFLE_ENDPOINT = "https://api.spotify.com/v1/me/player/shuffle?state=false";
const PREVIOUS_TRACK_ENDPOINT = "https://api.spotify.com/v1/me/player/previous";
const SKIP_ENDPOINT = "https://api.spotify.com/v1/me/player/next";
const PLAY_ENDPOINT ="https://api.spotify.com/v1/me/player/play";
const PAUSE_ENDPOINT = "https://api.spotify.com/v1/me/player/pause";
export const ALERT_MESSAGE = "No active player found! Please open Spotify on your device. If error persists, play a random song to get it started."

//TODO: when device has been found make sure we display shuffle and repeat when play is clicked
const NowPlaying = () => {

     
    return (
        <div>
            
        </div>
    )
}
  
export function pause(){
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
     fetch(PAUSE_ENDPOINT, requestOptions)
      .then((response) => function(){
        if(response.status === 401){
            console.log("Refreshing acess token")
            refreshAccessToken().then(pause());
        }
        else if(response.status === 204){
          localStorage.setItem("noActiveDevice", true);
          alert(ALERT_MESSAGE);
        } else if(response.status === 200){
          localStorage.setItem("noActiveDevice", false);
          console.log("Paused Song")
        }
      })
  }

  export function play(){
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
     fetch(PLAY_ENDPOINT, requestOptions)
      .then((response) => function(){
        if(response.status === 401){
            console.log("Refreshing acess token")
            refreshAccessToken().then(play());
        }
        else if(response.status === 204){
          localStorage.setItem("noActiveDevice", true);
          alert(ALERT_MESSAGE);
        } else if(response.status === 200){
          localStorage.setItem("noActiveDevice", false);
          console.log("Played Song")
        }
      })
  }
export function skipTrack(){
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
    fetch(SKIP_ENDPOINT, requestOptions)
      .then((response) => function(){
        if(response.status === 401){
            console.log("Refreshing access token")
            refreshAccessToken().then(skipTrack());
        }
        else if(response.status === 204){
          localStorage.setItem("noActiveDevice", true);
          alert("No active player found! Please open Spotify on your device.");
        } else if(response.status === 200){
          localStorage.setItem("noActiveDevice", false);
          console.log("Skipped Song")
        }
      })
  }
  export function previousTrack(){
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };
    fetch(PREVIOUS_TRACK_ENDPOINT, requestOptions)
      .then((response) => function(){
        if(response.status === 401){
            console.log("Refreshing access token")
            refreshAccessToken().then(previousTrack());
        }
        else if(response.status === 204){
          localStorage.setItem("noActiveDevice", true);
          alert(ALERT_MESSAGE);
        } else if(response.status === 200){
          localStorage.setItem("noActiveDevice", false);
          console.log("Went back a Song")
        }
      })
  }
export function disableShuffleandRepeat(){
    const requestOptions = {
      method: 'PUT',
      headers: {
       Authorization: 'Bearer ' + token,
       'Content-Type': 'application/json',
     },
   }
   fetch(TOGGLE_REPEAT_ENDPOINT, requestOptions)
   .then((data) => function(){
     if(data.status === 401){
        console.log("Refreshing access token")
        refreshAccessToken().then(disableShuffleandRepeat());
     }
     else if(data.status === 404){
       localStorage.setItem("noActiveDevice", true);
       alert(ALERT_MESSAGE);
     } else if(data.status === 200){
       localStorage.setItem("noActiveDevice", false);
       console.log("Disabled repeat")
     }
   })
   fetch(TOGGLE_SHUFFLE_ENDPOINT, requestOptions)
   .then((data) => function () {
     if(data.status === 404){
       localStorage.setItem("noActiveDevice", true);
       alert(ALERT_MESSAGE);
     } else if(data.status === 200){
       localStorage.setItem("noActiveDevice", false);
       console.log("Disabled shuffle")
     }
   })
 }
 
export async function getNowPlaying(){
    let ret = "";
    await axios
    .get(CURRENTLY_PLAYING_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      if(response.status === 401){
        console.log("Refreshing access token")
        refreshAccessToken().then(getNowPlaying());
      }
      else if(response.status === 200){
          ret = {title: response.data.item.name, artist: response.data.item.artists[0].name, uri: response.data.item.uri};
      } else if (response.status === 204) {
          if(!localStorage.getItem("noActiveDevice")){
              localStorage.setItem("noActiveDevice", true);
              alert(ALERT_MESSAGE);
          }
      }
    })
    .catch((error) => {
      console.log(error + " with getting songs in playlist");
    });
    return ret;
  }
export default NowPlaying
