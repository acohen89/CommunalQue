import React, {useState} from 'react';
import './styles/MainQue.css';
import firebase from "./firesbase";
import {WEB_URL} from "./Home";
import Button from "./Button";
import InQue from './InQue';
const TEST_HASH = "testHash";
const db = firebase.firestore();
const hash = getHash(6);
const docRef = db.collection("Active Ques").doc(TEST_HASH);




function MainQue() {
  const [songs, setSongs] = useState([{id: "123kf21", title: "Piano Man", artist: "Billy Joel"}, 
  {id: "198213da", title: "She's Always A Woman", artist: "Billy Joel"}]);
  
  const refresh = () => {
    console.log("refreshed")
    docRef.get().then((doc) => {
      if (doc.exists) {
          setSongs(songs => (songs = doc.data().songs))
        } else { console.log("No such document!");}
      }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }

  return (
    <>
    <h>
      useEffect(() => {
          <p> Que With Id: {hash} </p>
      }, [])
       <Button text="End Que" onClick={endQue} />
    </h>
      <InQue songs = {songs}/>
      <Button text="Refresh" onClick={refresh}/> 
    </>
  );
}
const endQue = () => {
  // migrate data to past ques collection 
  // go to home page
  window.location.href = WEB_URL;
  
}
function getHash(){
  const hash = makeHash(6);
  console.log("Fire")
  db.collection("Active Ques").doc(hash).set({
    Songs: []
  })
  .then((docRef) => {
    console.log("Document written sucesfully");
    return hash;
    
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    return hash;
  });
  return hash;
  
}
function makeHash(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}


export default MainQue;

