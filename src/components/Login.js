import axios from 'axios';
import React from 'react';
import Button from './Button';
import './styles/ZevsStyles.scss';
const APP_DESCRIPTIONP1 = "Communal Queue allows you to make a queue that both you and your friends can add to. To begin, login to Spotify and click start queue. " 
const APP_DESCRIPTIONP2 = "You will be given a queue id that your friends can then use to access the same queue and add songs. ";
const WEB_URL = "http://localhost:3000";
export {WEB_URL}; 
const REDIRECT_URL_AFTER_LOGIN = WEB_URL + '/Home';
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPACE_DELIMITER = '%20';
const SCOPES = [
  "playlist-modify-private",
  "playlist-modify-public", 
  "playlist-read-private",
  "app-remote-control",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
  "streaming",
  "user-read-private",
  "user-read-email",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize?client_id=" + CLIENT_ID + "&response_type=code&redirect_uri=" + REDIRECT_URL_AFTER_LOGIN +"&scope=" + SCOPES_URL_PARAM;

const Login = () => {
  const login = () => {
    window.location = SPOTIFY_AUTHORIZE_ENDPOINT;
  };
  return (
    <div className="bg">
      <p className="header" style={{ margin: 50 }}>
        Welcome To Communal Queue
      </p>
      <p className="body" style={{ marginBottom: 30 }}>
        Please login to begin
      </p>
      <p>{APP_DESCRIPTIONP1}</p>
      <p>{APP_DESCRIPTIONP2}</p>
      <Button text="LOGIN TO SPOTIFY" onClick={login} />
      <p className="credits">Created by Adam Cohen and Zev Ross</p>
    </div>
  );
};

export default Login;
