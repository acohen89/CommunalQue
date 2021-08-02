import React, {useEffect} from "react";
import './styles/Home.css';
// import MainQue from "./MainQue";
import Button from "./Button"
import {HASH_LENGTH} from "./MainQue"
// import GoodLogin from "./GoodLogin";
// import { WorkRounded } from "@material-ui/icons";

const port = 3000;
const WEB_URL = "http://localhost:"  + port;
const inputID = "queueID";
export {WEB_URL}; 

const joinQueue = () => {
  const queueID =   document.getElementById(inputID).value;
  const url = WEB_URL + "/JoinQueue?queueID=" + queueID;
  window.location = url;
};
const startQueue = () => {
  window.location = WEB_URL + "/Queue";
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
  if(urlParams.get("error")){
    window.location = WEB_URL;
  } else {
    return (
      <div >
      <h1 ><Button text = "Join Existing Queue" onClick = {joinQueue} /> </h1>
      <input type="text" name="queueID" id= {inputID} placeholder="Enter Queue ID" minLength= {HASH_LENGTH} maxLength={HASH_LENGTH}  onKeyPress={enterPressed}/>
      <h2><Button text = "Start a Queue" onClick = {startQueue} /> </h2>
      </div>
    );
  }
}

export default Home;
