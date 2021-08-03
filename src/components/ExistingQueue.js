import React, { useState } from 'react';
import firebase from './firesbase';
import Button from './Button';
import InQue from './InQue';
import SearchBar from './SearchBar';
import { HASH_LENGTH } from './MainQue';
import './styles/ZevsStyles.scss';
const urlParams = new URLSearchParams(window.location.search);
const db = firebase.firestore();

let docRef;
urlParams.get('queueID')
  ? (docRef = db.collection('Active Ques').doc(urlParams.get('queueID')))
  : (docRef = null);
//TODO: need to get spotify auth form link still
const queueID = urlParams.get('queueID');
localStorage.setItem('queueID', queueID);
export { docRef };

const ExistingQueue = () => {
  const [songs, setSongs] = useState([
    { id: '1', title: '', artist: '', inQueue: true },
    { id: '2', title: '', artist: '', inQueue: true },
  ]);
  const refresh = () => {
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setSongs((songs) => (songs = doc.data().songs));
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  };
  const back = () => {
    window.history.back();
  };
  if (
    !urlParams.get('queueID') ||
    urlParams.get('queueID').length !== HASH_LENGTH
  ) {
    return (
      <div className="bg">
        <p className="body" style={{ margin: 70 }}>
          {' '}
          Enter a valid Queue ID
        </p>
        <Button text="Back" onClick={back} />
      </div>
    );
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
        <div className="darkContainer">
          <p className="queueTitle" style={{ marginLeft: 35, marginRight: 10 }}>
            Queue
          </p>
          <p className="queueID">ID: {urlParams.get('queueID')}</p>
          <div style={{ margin: 20 }}>
            <Button text="Back" onClick={back} />
          </div>
        </div>
        <div
          className="darkContainer"
          style={{
            padding: 30,
            flexDirection: 'column',
            alignItems: 'stretch',
            minWidth: 700,
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexGrow: 2,
              justifyContent: 'space-between',
            }}
          >
            <p className="queueTitle" style={{ fontSize: 30, color: 'gray' }}>
              Songs in queue
            </p>
            <Button text="Refresh" onClick={refresh} />
          </div>
          <InQue songs={songs} />
        </div>
        <p className="credits">Created by Adam Cohen and Zev Ross</p>
        <SearchBar />
      </div>
    );
  }
};

export default ExistingQueue;
