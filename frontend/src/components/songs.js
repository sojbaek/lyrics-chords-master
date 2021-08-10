import React, { useState, useEffect } from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";

import LyricsWithChords from '../lyricsWithChords.js'

const Transpose = props => {
 // console.log("default key=" + props.selected)
 // console.log("keys=" + props.keys)
    return (
      <form>
        <label>
          Key:
          <select value={props.selected} onChange={props.onKeyChange} >
            { props.keys.map(key => {
              return(
                <option value={key} >{key}</option>
              )
            }) 
            }
          </select>
        </label>
      </form>
    );
}

function Lyrics(props) {
  return (
    <span>
      <pre>
         { props.text.join('\n')}
      </pre>
    </span>
  );
}

const Song = props => {
  const initialSongState = {
    id: null,
    title: "",
    artist: "",
    genre: "",
    youtube: "",
    lyric: []
  };

  let editing = false;

  const [song, setSong] = useState(initialSongState);
  const [key, setKey] = useState("");
  const [lyrics, setLyrics] = useState(null);
  const [keys, setKeys] = useState([]);
  const [transeposedLyrics, setTransposedLyrics] = useState([]);

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
        setSong(response.data);
        console.log(response.data);
        console.log("song="+ song)
        setLyrics(new LyricsWithChords(song["lyric"].join('\n')))
        console.log("lyrics="+ lyrics)
        setKeys(lyrics.getTransposalKeys())
        console.log("keys="+ keys)
        setKey(keys[6])
        console.log("key="+ key)
        setTransposedLyrics(lyrics.transpose(keys.indexOf(key)-6))
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getSong(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    //setLyric(event.target.value);
  };

  const deleteSong = (songId, index) => {
    SongDataService.deleteSong(songId, props.user.id)
      .then(response => {
        setSong((prevState) => {
          prevState.songs.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onChangeKey = e => {
    setKey( e.target.value );
    setTransposedLyrics(lyrics.transpose(keys.indexOf(e.target.value)-6))
    console.log("new key=" + e.target.value )
   // setSearchCuisine(searchCuisine);
  };

  return (
    <div>
      {song ? (
        <div>
          <h5>{song.title} - {song.artist}</h5> 
          <br/>
          <p>
            <strong>Artist: </strong>{song.artist} <br/>
            <strong>Genre: </strong>{song.genre} <br/>
            <div className="form-group">
              <strong><label for="lyrics"></label></strong>
            </div>
            <div className="form-group">
              <br></br>
              <Transpose keys={keys} selected={key} 
                onKeyChange={onChangeKey}>
              </Transpose>
              <br/>
              <Lyrics text={transeposedLyrics}/>
            </div>
          </p>
          {//<iframe allowfullscreen="true" frameborder="0"  src={song.youtube} title={song.title}></iframe><br/>
          }
        </div>
      ) : (
        <div>
          <br />
          <p>No song selected.</p>
        </div>
      )}
    </div>
  );
};

export default Song;