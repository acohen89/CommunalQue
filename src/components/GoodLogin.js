import './styles/GoodLogin.css';
import SpotifyGetPlaylists from "./SpotifyGetPlaylists";
import React, { useEffect } from "react";


export const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};


export function GoodLogin() { 
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
        window.history.pushState({}, document.title, "/");
        localStorage.clear();


      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
      console.log(access_token)
    }
  }, []);

  return (
    <body>
        <p>Sucessful Login!</p>
  
        <SpotifyGetPlaylists />
    </body >
  );
}

export default GoodLogin;
