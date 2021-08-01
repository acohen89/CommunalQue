import React from 'react';
import {MdAdd} from "react-icons/md";
import {queueID} from "./ExistingQueue";
import firebase from "./firesbase";
const db = firebase.firestore();

const Song = ({uri, title, artist, inQueue}) => {
const docRef = db.collection("Active Ques").doc(queueID);

    const addSong = () => {
        docRef.update({songs:firebase.firestore.FieldValue.arrayUnion({
            artist: artist,
            id: uri,    
            title: title})
        })
        .then(() => {
            console.log("Added " + title + " to database!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
    if(inQueue){
        return (
            <div>
                 <p id={uri} key = {uri} > {title} {artist} </p> 
            </div>
                )
    } else{
        return (
            <div>
                 <p id={uri} key = {uri} > {title} {artist} <MdAdd onClick={addSong}/> </p> 
            </div>
                )
    }
}
Song.defaultProps = {
    uri: "testURi",
    name: "TestName",
    artist: "Test Artist",
    inQueue: true,
}

export default Song
