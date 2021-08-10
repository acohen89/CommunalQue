import React, { useEffect } from 'react';
import axios from 'axios';

import './styles/ZevsStyles.scss';
import Button from './Button';
import { HASH_LENGTH } from './MainQueue/MainQue';
import { PostAdd } from '@material-ui/icons';
const cors = require('cors');
const port = 3000;
const WEB_URL = 'http://localhost:' + port;
const inputID = 'queueID';
const redirect_uri = WEB_URL + '/Home';
const client_id = '35135547562945148a4c9129b244dfe8';
const TOKEN = 'https://accounts.spotify.com/api/token';
const client_secret = '818c3697a3314a469cf9fb841abe6626';
export { WEB_URL };

const joinQueue = () => {
  const queueID = document.getElementById(inputID).value;
  if (queueID.length === HASH_LENGTH) {
    const url = WEB_URL + '/JoinQueue?queueID=' + queueID;
    window.location = url;
  } else {
    alert('Enter a valid QueueID');
  }
};
const startQueue = () => {
  window.location = WEB_URL + '/Queue';
};

function Home() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  useEffect(() => {
    fetchAccessToken(code);
  }, []);

  const enterPressed = (e) => {
    if ( e.key === 'Enter' && document.getElementById(inputID).value.length === HASH_LENGTH) {
      joinQueue();
    }
  };
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split('&');
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split('=');
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  };
  useEffect(() => {
    const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
    if(access_token !== undefined && expires_in !== undefined && token_type !== undefined){
      localStorage.clear(); 
      localStorage.setItem('token', access_token);
      localStorage.setItem('expiresIn', expires_in);
      localStorage.setItem('tokenType', token_type);
    }
  }, []);
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
var access_token = null;
var refresh_token = null;

export function refreshAccessToken() {
  refresh_token = localStorage.getItem('refresh_token');
  let body = 'grant_type=refresh_token';
  body += '&refresh_token=' + refresh_token;
  body += '&client_id=' + client_id;
  callAuthorizationApi(body);
}
function handleAuthorizationResponse() {
  if (this.status === 200) {
    var data = JSON.parse(this.responseText);
    if (data.access_token !== undefined) {
      access_token = data.access_token;
      localStorage.setItem('token', access_token);
    }
    if (data.refresh_token !== undefined) {
      refresh_token = data.refresh_token;
      localStorage.setItem('refresh_token', refresh_token);
    }
  } else {
    console.log(this.responseText);
  }
}
function fetchAccessToken(code) {
  let body = 'grant_type=authorization_code';
  body += '&code=' + code;
  body += '&redirect_uri=' + encodeURI(redirect_uri);
  body += '&client_id=' + client_id;
  body += '&client_secret=' + client_secret;
  callAuthorizationApi(body);
}
function callAuthorizationApi(body) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader(
    'Authorization',
    'Basic ' + btoa(client_id + ':' + client_secret)
  );
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

export default Home;
