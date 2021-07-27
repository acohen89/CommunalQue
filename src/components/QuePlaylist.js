import React, { useEffect, useState } from "react";
import axios from "axios";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const QuePlaylist = () => {
 

  const [token, setToken] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  const makePlaylist = () => {
    console.log("in que playlist")
    axios
      .post(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
            "name": "Test Playlist",
            "description": "New playlist description",
            "public": true
        }
      })
      .then((response) => {
        console.log(response.data)
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (<>
  {makePlaylist}
  </>
    );    
    // <>
    //   <button onClick={handleGetPlaylists}>Get Playlists</button>
    //   {data?.items ? data.items.map((item) => console.log(item)) : null}
    // </>
};

export default QuePlaylist;