import React, {useState} from 'react';
import firebase from "./firesbase";
import Button from "./Button";
import InQue from './InQue';
import SearchBar from "./SearchBar";

import { HASH_LENGTH } from './MainQue';
const urlParams = new URLSearchParams(window.location.search);
const db = firebase.firestore();

let docRef;
urlParams.get("queueID") ? docRef = db.collection("Active Ques").doc(urlParams.get("queueID")) : docRef = null;
//TODO: need to get spotify auth form link still 

const ExistingQueue = () => {
    const [songs, setSongs] = useState([{id: "", title: "", artist: ""}, {id: "", title: "", artist: ""}]);
    const refresh = () => {
        docRef.get().then((doc) => {
            if (doc.exists) {
              setSongs(songs => (songs = doc.data().songs))
            } else { console.log("No such document!");}
            }).catch((error) => {
              console.log("Error getting document:", error);
          });   
    }
    const back = () => {
        window.history.back();
    }
    if(!urlParams.get("queueID") || urlParams.get("queueID").length !== HASH_LENGTH){
        return (
        <>
        <p> Enter a valid Queue ID</p>
        <Button text="Back" onClick={back}/>
        </>
        )
    } else {
        return (
            <div>
                <p>Queue with id {urlParams.get("queueID")}</p>
                <p><u>Current Songs in Queue</u></p>
                <InQue songs = {songs}/>
                <p><Button text="Back" onClick={back}/></p>
                <Button text="Refresh" onClick={refresh}/>
                <SearchBar/> 
            </div>
        )

    }
}

export default ExistingQueue
