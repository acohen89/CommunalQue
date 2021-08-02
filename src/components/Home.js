import React from 'react';
import './styles/ZevsStyles.scss';
// import MainQue from "./MainQue";
import Button from './Button';
import { HASH_LENGTH } from './MainQue';
// import GoodLogin from "./GoodLogin";
// import { WorkRounded } from "@material-ui/icons";

const port = 3000;
const WEB_URL = 'http://localhost:' + port;
const inputID = 'queueID';
export { WEB_URL };

const joinQueue = () => {
  const queueID = document.getElementById(inputID).value;
  const url = WEB_URL + '/JoinQueue?queueID=' + queueID;
  window.location = url;
};
const startQueue = () => {
  window.location = WEB_URL + '/Queue';
};

function Home() {
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
  // if(window.location.pathname !== "/"){ // checking if just logged into spotify TODO: eventually have
  //   return (
  //     <body>
  //       <MainQue />
  //     </body>
  //   );
  // } else {
  //   return (
  //     <>
  //     <body >
  //         <p>Welcome To Communal Queue!</p>
  //         <p>Please login</p>
  //         <Button text = "Login To Spotifty" onClick = {login} />
  //         <Button text = "Start a Queue" onClick = {login} />
  //     </body >
  //     <p>
  //       <Button text = "Join an existing Queue" onClick = {joinQueue}/>
  //     </p>
  //     </>
  //   );
  // }
}

export default Home;
