import React, { useState } from "react";
import RestaurantDataService from "../services/song";
import { Link } from "react-router-dom";

const AddSong = props => {
    const initialSongState = {
    id: null,
    title: "",
    artist: "",
    genre: "",
    youtube: "",
    lyric: []
  };


  let editing = false;

  if (props.location.state && props.location.state.currentSong) {
    editing = true;
    initialSongState = props.location.state.currentSong
  }

  const [song, setSong] = useState(initialSongState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setSong(event.target.value);
  };

  const saveSong = () => {
    var data = {
      title: "",
      artist: "",
      genre: "",
      youtube: "",
      lyric: [],
      name: props.user.name,
      user_id: props.user.id,
      song_id: props.match.params.id
    };

    if (editing) {
      data.song_id = props.location.state.currentSong._id
      RestaurantDataService.updateSong(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      RestaurantDataService.createSong(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/songs/" + props.match.params.id} className="btn btn-success">
              Back to Song
            </Link>
          </div>
        ) : (
          <div>
              <label htmlFor="description">{ editing ? "Edit" : "Create" } a song</label>
            <div className="form-group">
              <h4>Title:</h4>
              <input
                type="text"
                className="form-control"
                id="textTitle"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <div className="form-group">
              <h4>Artist:</h4>
              <input
                type="text"
                className="form-control"
                id="textArtist"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <div className="form-group">
              <h4>Genre:</h4>
              <input
                type="text"
                className="form-control"
                id="textGenre"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <div className="form-group">
              <h4>Lyrics:</h4>
              <input
                type="text"
                className="form-control"
                id="textGenre"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveSong} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;