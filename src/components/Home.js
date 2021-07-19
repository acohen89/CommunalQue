import React, { useEffect } from "react";
import './styles/Home.css';


const CLIENT_ID = "161c6b8ff4a9482d962700e1b41cac89"; // QueQue id
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "https://communalque.hostman.site/gLog";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "app-remote-control",
  "streaming",
  "user-read-currently-playing",
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-modify"

];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);


const login = () => {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
};

function Home() {
  return (
    <body >
        <p>Welcome To Communal Que!</p>
        <button onClick={login}>Login to Spotify</button>
    </body >
  );
}

export default Home;
