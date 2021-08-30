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
    lyrics: ""
  };


  let editing = false;

  if (props.location.state && props.location.state.currentSong) {
    editing = true;
    initialSongState = props.location.state.currentSong
  }

  const [song, setSong] = useState(initialSongState);
  const [submitted, setSubmitted] = useState(false);

  const handleTitleChange = event => {
    setSong(prevState => {
      let song = Object.assign({}, prevState.song);  // creating copy of state variable jasper
      song.title = event.target.value;                     // update the name property, assign a new value                 
      return { song };                                 // return new object jasper object
    })
  };

  const saveSong = () => {
    var data = {
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      youtube: song.youtube,
      lyric: song.lyric,
      user_id: props_user.id,
      name: props.user.name,
      song_id: props.match.params.id
    };
    console.log("props.user="+ props.user)
    console.log("song.title="+ song.title)
    console.log("song.genre="+ song.genre)
    console.log("song.artist="+ song.artist)
    console.log("song.lyric="+ song.lyric)
    console.log("title=" + song.title)
    if (editing) {
      data.song_id = props.match.params.id
        SongDataService.updateSong(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      SongDataService.createSong(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  console.log("props.user="+ props.user)
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
              Title:
              <input
                type="text"
                className="form-control"
                id="textTitle"
                required
                value={song.title}
                onChange={handleTitleChange}
                name="textTitle"
              />
            </div>
            <div className="form-group">
              Artist:
              <input
                type="text"
                className="form-control"
                id="textArtist"
                required
                value={song.artist}
                name="textArtist"
              />
            </div>
            <div className="form-group">
              Genre:
              <input
                type="text"
                className="form-control"
                id="textGenre"
                required
                value={song.genre}
                name="text"
              />
            </div>
            <div className="form-group">
              Youtube (embedID only):
              <input
                type="text"
                className="form-control"
                id="textYoutube"
                required
                value={song.youtube}
                name="textYoutube"
              />
            </div>

            <div class="mb-3">
              <label for="FormControlTextarea1" class="form-label">Lyrics</label>
              <textarea class="form-control" id="TextareaLyrics" rows="20" > 
              </textarea>
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

export default AddSong;