import React, { useState , useEffect} from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  layoutroot: {
    flexGrow: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '70ch',
    },
  },
  sub: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '20ch',
    },
  },
}));


const randHex = len => {
  var  maxlen = 8
  var  min = Math.pow(16,Math.min(len,maxlen)-1) 
  var  max = Math.pow(16,Math.min(len,maxlen)) - 1
  var  n   = Math.floor( Math.random() * (max-min+1) ) + min
  var  r   = n.toString(16)
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};


const EditSong = props => {
  
  const classes = useStyles();
      
  let initialSongState = {
    _id: "",
    title: "",
    artist: "",
    genre: "",
    youtube: "",
    lyric: [],
    user_id: ""
  };

  let props_user = { name: "test", id: "0" }
  let editing = false;

  console.log("props.location=" )
  console.log(props.location);

  //if (props.location.state && props.location.state.currentSong) {
  //  editing = true;
  //  initialSongState = props.location.state.currentSong
  //}

  if (props.match.params.id) {
    editing = true;
   // initialSongState = props.location.state.currentSong
   // console.log(props.location);
  }

  console.log("editing=" +editing);

  const [lyrics, setLyrics] = useState("");
  const [song, setSong] = useState(initialSongState);
  const [submitted, setSubmitted] = useState(false);
  const [genres, setGenres] = useState(["All genres"]);

  useEffect(() => {
    if (props.match.params.id) {
       getSong(props.match.params.id);
    }    
    retrieveGenres();
  }, [props.match.params.id]);

  const retrieveGenres = () => {
    SongDataService.getGenres()
      .then(response => {
       setGenres([].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

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
      name: props_user.name,
      _id: props.match.params.id
    };

    console.log("props.user="+ props.user)
    console.log("song.title="+ song.title)
    console.log("song.genre="+ song.genre)
    console.log("song.artist="+ song.artist)
    console.log("song.lyric="+ song.lyric)
    console.log("title=" + song.title)
    console.log("song_id = " + song._id)

    if (editing) {                
        SongDataService.updateSong(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {      
      data._id = randHex(24);
      setSong( (state) => {
        return {...state, _id : data._id}
       });
      console.log("new song_id=" + data._id)
      SongDataService.createSong(data)
        .then(response => {
          setSubmitted(true);
          console.log("song created->")
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  console.log("editing=" + editing)
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
            <Link to={"/songs/" + song._id} className="btn btn-success">
              Back to Song
            </Link>
          </div>
        ) : (
          <div>
             { /*
                <label htmlFor="description"><h2>{ editing ? "Edit" : "Create" } a song</h2></label>
             */ } 
        
            <div className={classes.layoutroot}>
              <Grid container spacing={3}>
                <Grid item xs>
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="textfield-title" label="제목 Title"  value={song.title} onChange={handleTitleChange}/>
                  </form>
                </Grid>
                <Grid item xs>
                  <form className={classes.sub} noValidate autoComplete="off">
                   <TextField id="textfield-artist" label="가수 Artist"  value={song.artist} onChange={handleArtistChange}/>
                   </form>
                </Grid> 
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs>
                    <div className={classes.sub}> 
                        <InputLabel id="label-genre">장르 Genre</InputLabel>
                        <Select
                          labelId="label-genre"
                          id="label-genre-list"
                          value={song.genre}
                          onChange={handleGenreChange}
                        >
                          <MenuItem value="">
                          <em>없음 None</em>
                          </MenuItem>
                          {genres.map(genre => {
                              return (
                                <MenuItem value={genre}> {genre} </MenuItem>
                              )
                            })}
                        </Select>
                        <FormHelperText>Some important helper text</FormHelperText>
                      </div>
                </Grid>
                <Grid item xs>
                    <FormControl className={classes.formControl}>
                     <TextField id="textfield-youtube" label="유튜브 Youtube"  value={song.youtube} onChange={handleYoutubeChange}/>
                    <FormHelperText>Some important helper text</FormHelperText>
                 </FormControl>
                </Grid> 
              </Grid>

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