import React, { useState, useEffect } from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";

const Song = props => {
  const initialSongState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
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

  const deleteReview = (reviewId, index) => {
    SongDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setSong((prevState) => {
          prevState.reviews.splice(index, 1)
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
              <textarea
                rows="50"
                cols="100"
                className="form-control"
                id="lyrics"
                onChange={handleInputChange}
                name="text"
              >{song.lyric}</textarea>
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

export default Song;