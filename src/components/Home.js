import React from "react";
import './styles/Home.css';
import MainQue from "./MainQue";
import Button from "./Button"
import {HASH_LENGTH} from "./MainQue"
import GoodLogin from "./GoodLogin";
import { WorkRounded } from "@material-ui/icons";

const port = 3000;
const WEB_URL = "http://localhost:"  + port;
const inputID = "queueID";
export {WEB_URL}; 
const CLIENT_ID = "35135547562945148a4c9129b244dfe8"; // Testing iD
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = WEB_URL + "/Home";
const SPACE_DELIMITER = "%20";
const SCOPES = [
 "playlist-modify-private",
 "playlist-modify-public",
 "playlist-read-private",
 "app-remote-control",
 "user-library-modify",
 "user-library-read",
 "user-read-private",
 "user-read-email"

];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);


const login = () => {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
};

const joinQueue = () => {
  const queueID =   document.getElementById(inputID).value;
  const url = WEB_URL + "/JoinQueue?queueID=" + queueID;
  window.location = url;
};
const startQueue = () => {
  window.location = WEB_URL + "/Queue";
};



function Home() {
  return (
    <div >
    <h1 ><Button text = "Join Existing Queue" onClick = {joinQueue} /> </h1>
    <input type="text" name="queueID" id= {inputID} placeholder="Enter Queue ID" minLength= {HASH_LENGTH} maxLength={HASH_LENGTH}/>
    <h2><Button text = "Start a Queue" onClick = {startQueue} /> </h2>
    </div>
  );
  // if(window.location.pathname !== "/"){ // checking if just logged into spotify TODO: eventually have
  //   return (
  //     <body>
  //       <MainQue />
  //     </body>
  //   );
  // } else {
  //   return (
  //     <>
  //     <body >
  //         <p>Welcome To Communal Queue!</p>
  //         <p>Please login</p>
  //         <Button text = "Login To Spotifty" onClick = {login} />
  //         <Button text = "Start a Queue" onClick = {login} />
  //     </body >
  //     <p>
  //       <Button text = "Join an existing Queue" onClick = {joinQueue}/>
  //     </p>
  //     </>
  //   );
  // } 
  
}

export default Home;
