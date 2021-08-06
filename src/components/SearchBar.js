import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SearchBarSongs from './SearchBarSongs';
import './styles/ZevsStyles.scss';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const [songs, setSongs] = useState([]);
  const [searchBarFocus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);
  const searchID = 'searchBar';
  let updated = true;
  function updateSearch() {
      setSearch((search) => (search = document.getElementById(searchID).value));
    updated = false;
  }
  useEffect(() => {
    if (search !== '') {
      const url = SEARCH_ENDPOINT + '?q=' + search + '&type=track&limit=14';
      axios
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then(function (response) {
          setSongs(
            response.data.tracks.items.map((item) => ({
              uri: item.uri,
              title: item.name,
              artist: item.artists[0].name,
              duration: item.duration,
            }))
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [search, token]);
  return (
    <div className="searchBarContainer" style={{ width: 350, height: 50 }}>
      <input
        className="searchBar"
        autoComplete="off"
        type="text"
        name={searchID}
        id={searchID}
        placeholder="Search for a song"
        onChange={updateSearch}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {search !== '' && searchBarFocus === true ? (
        <div className="searchSuggestions">
          <SearchBarSongs songs={songs} />
        </div>
      ) : null}
    </div>
  );
};
export default SearchBar;
