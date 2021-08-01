import React, { useState, useEffect } from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";
//import { makeStyles } from "@material-ui/core/styles";
//import TextField from "@material-ui/core/TextField";

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

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
        setSong(response.data);
        console.log(response.data);
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

  return (
    <div>
      {song ? (
        <div>
          <h5>{song.title}</h5>
          <p>
            <strong>Genre: </strong>{song.genre}<br/>
            <strong>Artist: </strong>{song.artist}<br/>
            <strong>Youtube: </strong>{song.youtube}<br/>
            <strong><label for="lyrics">lyrics:</label></strong>
            <div className="form-group">
              <label htmlFor="lyrics">{ editing ? "Edit" : "Create" }Lyrics</label>
              <textarea class="form-control" id="lyrics" rows="20" onChange={handleInputChange}>
              Hello1
              Hello2
              </textarea>
            </div>
          </p>
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

//export default Song;