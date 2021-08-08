import React, {useEffect} from "react";
import './styles/ZevsStyles.scss';
import Button from './Button';
import { HASH_LENGTH } from './MainQueue/MainQue';
const cors = require("cors");
const port = 3000;
const WEB_URL = 'http://localhost:' + port;
const inputID = 'queueID';
const redirect_uri = WEB_URL + "/Home";
const client_id = "35135547562945148a4c9129b244dfe8";
const TOKEN = "https://accounts.spotify.com/api/token";
const client_secret = "818c3697a3314a469cf9fb841abe6626";
export { WEB_URL };

const joinQueue = () => {
  const queueID = document.getElementById(inputID).value;
  if(queueID.length === HASH_LENGTH){
    const url = WEB_URL + '/JoinQueue?queueID=' + queueID;
    window.location = url;
  } else {
    alert("Enter a valid QueueID")
  }
};
const startQueue = () => {
  window.location = WEB_URL + '/Queue';
};

function Home() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  useEffect(() => {
    fetchAccessToken(code);
    window.history.pushState({}, document.title, "/home");
  }, [])
  
  const enterPressed = e => {
    if (e.key === "Enter" && document.getElementById(inputID).value.length === HASH_LENGTH) {
      joinQueue();
    }
  };
  if (urlParams.get('error')) {
    window.location = WEB_URL;
  } else {
    return (
      <div
      className="bg"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
        <p className="header" style={{ marginTop: 70 }}>
          Communal Queue
        </p>
        <div className="darkContainer">
          <div className="form" style={{ margin: 20 }}>
            <input
              className="form__input"
              type="text"
              name="queueID"
              placeholder="Input ID"
              id={inputID}
              autoComplete="off"
              minLength={HASH_LENGTH}
              maxLength={HASH_LENGTH}
              onKeyPress={enterPressed}
            />
          </div>
          <div style={{ margin: 20 }}>
            <Button text="Join Existing Queue" onClick={joinQueue} />{' '}
          </div>
        </div>
        <Button text="Start a Queue" onClick={startQueue} />{' '}
        <p className="credits">Created by Adam Cohen and Zev Ross</p>
      </div>
    );
  }
}

function fetchAccessToken(code){
  let body = "grant_type=authorization_code";
  body += "&code=" + code; 
  body += "&redirect_uri=" + encodeURI(redirect_uri);
  body += "&client_id=" + client_id;
  body += "&client_secret=" + client_secret;
  callAuthorizationApi(body);
}
function callAuthorizationApi(body){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}
function handleAuthorizationResponse(){
  if (this.status === 200){
    var data = JSON.parse(this.responseText);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("expiresIn", data.expires_in);
  }
  else {
    console.log(this.responseText);
  }
}
export function refreshAccessToken(){
  let refresh_token = localStorage.getItem("refresh_token");
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + client_id;
  callAuthorizationApi(body);
}
export default Home;
