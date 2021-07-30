import axios from 'axios';
import React, {useState, useEffect} from 'react'
import SongInQue from "./SongInQue";
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");
    const [songs, setSongs] = useState([{id: "123kf21", title: "Piano Man", artist: "Billy Joel"}, 
    {id: "198213da", title: "She's Always A Woman", artist: "Billy Joel"}]);
    // const [songs, setSongs] = useState([{id: "", title: "", artist: ""}, {id: "", title: "", artist: ""}]);
    const searchID = "searchBar";
    function updateSearch (){
         setSearch(search => search = document.getElementById(searchID).value);
    }
    // element.addEventListener("change", (event) => {
    // });
 
    useEffect(() => {
        if(search !== ""){
            const url = SEARCH_ENDPOINT + "?q=" + search + "&type=track";  
            axios.get(url, {
                headers: {
                    Authorization: "Bearer " + token,
                }
              })
              .then(function (response) {
                console.log(response.data.tracks.items);
              })
              .catch(function (error) {
                console.log(error);
              })
            //setSongs(songs => songs.map)
        }
    }, [search])
    return (
        <div>
            <input type="text" name={searchID} id={searchID} placeholder="Search for a song" onChange={updateSearch} />
            <SongInQue songs={songs}/>
        </div>
    )
}

export default SearchBar
