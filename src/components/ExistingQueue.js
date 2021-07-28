import React, {useState} from 'react';
import firebase from "./firesbase";
import Button from "./Button";
import InQue from './InQue';
const urlParams = new URLSearchParams(window.location.search);
const db = firebase.firestore();
const docRef = db.collection("Active Ques").doc(urlParams.get("queueID"));
//TODO: need to get spotify auth form link still 

const ExistingQueue = () => {

    // const [songs, setSongs] = useState([{id: "", title: "", artist: ""}, 
    // {id: "", title: "", artist: ""}]);
    const [songs, setSongs] = useState([{id: "123kf21", title: "Piano Man", artist: "Billy Joel"}, 
    {id: "198213da", title: "She's Always A Woman", artist: "Billy Joel"}]);
    const refresh = () => {
        docRef.get().then((doc) => {
            if (doc.exists) {
              setSongs(songs => (songs = doc.data().songs))
            } else { console.log("No such document!");}
            }).catch((error) => {
              console.log("Error getting document:", error);
          });   
    }
    return (
        <div>
            <p>Queue with id {urlParams.get("queueID")}</p>
            <p><u>Current Songs in Queue</u></p>
            <InQue songs = {songs}/>
            <Button text="Refresh" onClick={refresh}/>
        </div>
    )
}

export default ExistingQueue
