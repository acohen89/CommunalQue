import React from 'react';
import './styles/MainQue.css';
import firebase from "./firesbase";
import {WEB_URL} from "./Home";

const db = firebase.firestore();
const hash = getHash(6);


function makeHash(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}
const endQue = () => {
    // migrate data to past ques collection 
    // go to home page
    window.location.href = WEB_URL;

}
function getHash(){
  const hash = makeHash(6);
  console.log("Fire")
    db.collection("Active Ques").add({
        QueId: hash,
        Songs: []
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        const refId = docRef.id;
        console.log(".then")
        return hash;

    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        console.log(".catch")
        return hash;
    });
    return hash;
    
}
function MainQue() {
    return (
      <body>
         <p> Que With Id: {hash} </p>
         <button onClick={endQue}> End Que </button> 
      </body >
    );
  }

export default MainQue;

