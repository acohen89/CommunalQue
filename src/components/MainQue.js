import React from 'react';
import './styles/MainQue.css';
import firebase from "./firesbase";

const db = firebase.firestore();

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
    // delete que here
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

    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    return hash;
}
function MainQue() {
  return (
    <body>
       <p> Que With Id: {getHash(6)} </p>
       <button onClick={endQue}> End Que </button> 
    </body >
  );
  }

export default MainQue;

