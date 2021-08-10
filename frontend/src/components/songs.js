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

  var lyrics = null;

  const [song, setSong] = useState(initialSongState);
  const [key, setKey] = useState("");
//  const [lyrics, setLyrics] = useState(null);
  const [keys, setKeys] = useState([]);
  const [transeposedLyrics, setTransposedLyrics] = useState([]);

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
        var currentSong = response.data
        setSong(currentSong);
        console.log("1.song.title="+ currentSong.title)
        lyrics = new LyricsWithChords(currentSong["lyric"].join('\n'));
        //setLyrics(lyr)
        console.log("2.lyrics.lyric="+ lyrics.lyric)
        var trkeys = lyrics.getTransposalKeys()
        setKeys(trkeys)
        console.log("3.keys="+ lyrics.getTransposalKeys())
        setKey(keys[6])
      //  var trkey = keys[6];
        console.log("4.key="+ trkeys[6])
        setTransposedLyrics(lyrics.transpose(trkeys.indexOf(trkeys[6])-6))
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
    if (lyrics != null) {
      setTransposedLyrics(lyrics.transpose(keys.indexOf(e.target.value)-6))
    }
    console.log("new key=" + e.target.value )
   // setSearchCuisine(searchCuisine);
  };

  return (
    <div>
      {song ? (
        <div>
          <h5>{song.title} - {song.artist}</h5> 
          <br/>
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