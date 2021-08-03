import React, {useEffect} from "react";
import './styles/ZevsStyles.scss';
import Button from './Button';
import { HASH_LENGTH } from './MainQue';


const WEB_URL = "https://communalque.hostman.site";
export {WEB_URL}; 

const inputID = 'queueID';
const joinQueue = () => {
  const queueID = document.getElementById(inputID).value;
  const url = WEB_URL + '/JoinQueue?queueID=' + queueID;
  window.location = url;
};
const startQueue = () => {
  window.location = WEB_URL + '/Queue';
};

function Home() {
  const enterPressed = e => {
  if (e.key === "Enter" && document.getElementById(inputID).value.length === HASH_LENGTH) {
    joinQueue();
  }
};
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});
    
    return paramsSplitUp;
  };
  useEffect(() => {
    const { access_token, expires_in, token_type } = getReturnedParamsFromSpotifyAuth(window.location.hash);
    if(access_token !== undefined && expires_in !== undefined && token_type !== undefined){
      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("expiresIn", expires_in);
      localStorage.setItem("tokenType", token_type);
      window.history.pushState({}, document.title, "/home");
    }
  }, [])
  const urlParams = new URLSearchParams(window.location.search);
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

export default Home;
