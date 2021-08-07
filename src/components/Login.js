import axios from 'axios';
import React from 'react';
import Button from './Button';
import './styles/ZevsStyles.scss';
const port = 3000;
const WEB_URL = 'http://localhost:' + port;
export { WEB_URL };
const REDIRECT_URL_AFTER_LOGIN = WEB_URL + '/Home';
const CLIENT_ID = '35135547562945148a4c9129b244dfe8'; // Testing iD
const SPACE_DELIMITER = '%20';
const SCOPES = [
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-private",
  "app-remote-control",
  "user-read-private",
  "user-read-email"
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
      <Button text="LOGIN TO SPOTIFY" onClick={login} />
      <p className="credits">Created by Adam Cohen and Zev Ross</p>
    </div>
  );
};

export default Login;
