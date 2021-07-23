import React from "react";
import './styles/Home.css';
import MainQue from "./MainQue";
import Button from "./Button"

const port = 3000;
const WEB_URL = "http://localhost:"  + port;
export {WEB_URL}; 
const CLIENT_ID = "35135547562945148a4c9129b244dfe8"; // Testing iD
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = WEB_URL + "/Home";
const SPACE_DELIMITER = "%20";
const SCOPES = [
 "playlist-modify-private",
 "playlist-read-private",
 "app-remote-control",
 "user-library-modify",
 "user-library-read"

];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);


const login = () => {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  
};



function Home() {
  if(window.location.pathname !== "/"){ // checking if just logged into spotify TODO: eventually have
    return (
      <body>
        <MainQue />
      </body>
    );
  } else {
    return (
      <body >
          <p>Welcome To Communal Que!</p>
          <Button text = "Start a Que" onClick = {login} />
      </body >
    );
  } 
  
}

export default Home;
