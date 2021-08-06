import React from 'react';
import { getSongsFromDB } from './MainQue';
import {MdAdd} from "react-icons/md";
import firebase from "./firesbase";
const db = firebase.firestore();

const Song = ({uri, title, artist, inQueue, played}) => {
    // URI IS WRONG 
    //console.log(uri, title, artist,)
    const queueID = localStorage.getItem("queueID");
    const docRef = db.collection("Active Ques").doc(queueID);
    
    async function removeSong(){
        const playlistID = localStorage.getItem("playlistID");
        const token = localStorage.getItem("token");
        if(playlistID === null || playlistID === undefined){
            console.error("Playist id = " + playlistID);
            return; 
        }
        if(uri.substring(0, 7) !== "spotify"){
            console.error("Invalid uri of " + uri);
            return; 
        }
        if(token === null || token === undefined){
            console.error("Invalid token of " + token);
            return; 
        }
        const RM_PLAYLIST_ENDPOINT = "https://api.spotify.com/v1/playlists/" + playlistID + "/tracks";
        const requestOptions = {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris: [uri]}),
            };
        fetch(RM_PLAYLIST_ENDPOINT, requestOptions)
        .then((response) => function () {
            console.log(response)
        })
        const dbSongs = await getSongsFromDB();
        let newSongs = [];
        for(let i = 0; i < dbSongs.length; i++){
            if(dbSongs[i].id !== uri){
                newSongs.push(dbSongs[i]);
            } else {
            console.log("Deleted song:  " + dbSongs[i].title + " from db");
            }
        }
        docRef.update({
            songs: newSongs
        });
    }
    const addSong = () => {
        if(artist === "" || title === "" || uri === ""){ 
            console.error("Can't add an empty song");
            return;
        }
        docRef.update({songs:firebase.firestore.FieldValue.arrayUnion({
            artist: artist,
            id: uri,    
            title: title,
            played: false })
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
        uri = "Random uri " + Math.floor(Math.random() * 99999)  
        artistKey = uri + Math.floor(Math.random() * 999);
    }
    if(played || played === undefined){
        return(
            <>
            </>
        )
    }
    else if(inQueue){
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
                    <p style={{color: 'red'}}>
                      <MdAdd onClick={addSong}/>
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
    played: false
}

export default Song
