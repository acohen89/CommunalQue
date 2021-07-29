import React from 'react';
import Button from "./Button";
const port = 3000;
const WEB_URL = "http://localhost:"  + port;
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


const Login = () => {
    const login = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
      } 
    return (
        <div>
            <p>Welcome To Communal Queue</p>
            <p>Please Login</p>
            <Button text = "Login To Spotify" onClick = {login}/>
        </div>
    )
}

export default Login