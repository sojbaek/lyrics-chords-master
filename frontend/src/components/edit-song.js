import React, { useState , useEffect} from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";

const EditSong = props => {
    const initialSongState = {
    id: null,
    title: "",
    artist: "",
    genre: "",
    youtube: "",
    lyrics: ""
  };


  let editing = true;

  if (props.location.state && props.location.state.currentSong) {
    editing = true;
    initialSongState = props.location.state.currentSong
  }

  const [song, setSong] = useState(initialSongState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSong(props.match.params.id);
  }, [props.match.params.id]);

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
        var currentSong = response.data
        setSong(currentSong);
      })
      .catch(e => {
        console.log(e);
      });
  };

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
      lyric: [],
      name: props.user.name,
      user_id: props.user.id,
      song_id: props.match.params.id
    };

    console.log("title=" + song.title)
    if (editing) {
      data.song_id = props.location.state.currentSong._id
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

  var props_user = "default_user"; // temporary

  console.log("props.user="+ props.user)
  return (
    <div>
      {  props_user ? ( //props.user ? (
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
              <label htmlFor="description"><h2>{ editing ? "Edit" : "Create" } a song</h2></label>
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

export default EditSong;