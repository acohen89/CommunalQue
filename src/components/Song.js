import React from 'react';
import {MdAdd} from "react-icons/md";
import firebase from "./firesbase";
const db = firebase.firestore();

const Song = ({uri, title, artist, inQueue}) => {
    const queueID = localStorage.getItem("queueID");
    const docRef = db.collection("Active Ques").doc(queueID);
    const addSong = () => {
        if(artist === "" || title === "" || uri === ""){ 
            console.error("Can't add an empty song");
            return;
        }
        docRef.update({songs:firebase.firestore.FieldValue.arrayUnion({
            artist: artist,
            id: uri,    
            title: title})
        })
        .then(() => {
            console.log("Added " + title + " to database!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }
    let artistKey = uri + artist;
    if(uri === "testURi") { 
        uri = Math.floor(Math.random() * 99999)  
        artistKey = uri + Math.floor(Math.random() * 999);
    }
    if(inQueue){
        return (
                <div style={{ display: 'flex' }}>
                    <p className="song" key={uri}>
                        {' '}
                        {title}
                    </p>
                    <p className="songArtist" key={artistKey}>
                        {' '}
                        {artist}
                    </p>
                </div>
                )
    } else{
        return (
            <div style={{ display: 'flex' }}>
                <p className="song" key={uri}>
                    {' '}
                    {title}
                </p>
                <p className="songArtist" key={artistKey}>
                    {' '}
                    {artist}
                </p> 
                <p>
                    <MdAdd onClick={addSong}/>
                </p>
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
