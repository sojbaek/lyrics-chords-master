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
            <textarea> { song.lyric.join() } </textarea>
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