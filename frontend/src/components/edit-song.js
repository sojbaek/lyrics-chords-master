import React, { useState , useEffect} from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";

const EditSong = props => {
    
  const initialSongState = {
    _id: "",
    title: "",
    artist: "",
    genre: "",
    youtube: "",
    lyric: [],
    user_id: ""
  };

  let props_user = { name: "test", id: "0" }
  let editing = true;

  if (props.location.state && props.location.state.currentSong) {
    editing = true;
    initialSongState = props.location.state.currentSong
  }
  
  const [lyrics, setLyrics] = useState("");
  const [song, setSong] = useState(initialSongState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getSong(props.match.params.id);
  }, [props.match.params.id]);

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
         console.log(response.data)
         setLyrics(response.data.lyric.join("\n"))
         setSong(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleTitleChange = event => {
    setSong( (state) => {
       return {...state, title : event.target.value}
    });
  };

  const handleGenreChange = event => {
    setSong( (state) => {
       return {...state, genre : event.target.value}
    });
  };

  const handleArtistChange = event => {
    setSong( (state) => {
       return {...state, artist : event.target.value}
    });
  };

  const handleYoutubeChange = event => {
    setSong( (state) => {
       return {...state, youtube : event.target.value}
    });
  };

  const handleLyricsChange = event => {
    setSong( (state) => {
       return {...state, lyric : event.target.value.split('\n')}
    });
    setLyrics(event.target.value)
  };


  const saveSong = () => {
    var data = {
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      youtube: song.youtube,
      lyric: song.lyric,
      user_id: props_user.id,
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
  console.log("song.title="+ song.title)
  console.log("song.genre="+ song.genre)
  console.log("song.artist="+ song.artist)
  console.log("song.lyric="+ song.lyric)
  console.log("song.youtube=" + song.youtube)


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
                onChange={handleArtistChange}
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
                onChange={handleGenreChange}
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
                onChange={handleYoutubeChange}
                name="textYoutube"
              />
            </div>

            <div class="mb-3">
              <label for="FormControlTextarea1" class="form-label">Lyrics</label>
              <textarea class="form-control" id="TextareaLyrics" rows="20" value={lyrics} 
              onChange={handleLyricsChange}> 
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