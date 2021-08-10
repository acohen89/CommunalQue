import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import SearchBarSongs from './SearchBarSongs';
import '../styles/ZevsStyles.scss';
import { refreshAccessToken } from '../Home';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';

const SearchBar = ({ docRef }) => {
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const [songs, setSongs] = useState([]);
  const [searchBarFocus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);
  const searchID = 'searchBar';

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          onBlur();
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function updateSearch() {
    setSearch((search) => (search = document.getElementById(searchID).value));
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
              duration: item.duration_ms,
              coverImage: handleImages(item.album.images),
            }))
          );
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.status === 401) {
            refreshAccessToken();
          }
        });
    }
  }, [search, token]);
  return (
    <div
      className="searchBarContainer"
      ref={wrapperRef}
      style={{ width: 350, height: 50 }}
    >
      <input
        className="searchBar"
        autoComplete="off"
        type="text"
        name={searchID}
        id={searchID}
        placeholder="Search for a song"
        onChange={updateSearch}
        onFocus={onFocus}
      />
      {search !== '' && searchBarFocus ? (
        <div className="searchSuggestions">
          <SearchBarSongs songs={songs} docRef={docRef} />
        </div>
      ) : null}
    </div>
  );
};
export function handleImages(imgArr){
  let imgUrl = null;
  let curSmLength = 999999999999999999999999999999;
  for (let i = 0; i < imgArr.length; i++) {
    if (imgArr[i].height < curSmLength) {
      curSmLength = imgArr[i].height;
      imgUrl = imgArr[i].url;
    }
  }
  return imgUrl;
}
export default SearchBar;
