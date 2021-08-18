import React, { useState, useEffect } from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";
import "../App.css"
import LyricsWithChords from '../lyricsWithChords.js'
import YoutubeEmbed from "./youtube-embed";
import GChord from "./chords";
import ChordsList from "./chords-list";

const Transpose = props => {
    return (
      <form>
        <label>
          Key:
          <select value={props.selected} onChange={props.onKeyChange} >
            { props.keys.map(kk => {
              return(
                <option value={kk} >{kk}</option>
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

  const [song, setSong] = useState(initialSongState);
  const [key, setKey] = useState("");
  const [lyrics, setLyrics] = useState(null);
// const [keys, setKeys] = useState([]);
  const [transeposedLyrics, setTransposedLyrics] = useState([]);
  const [genres, setGenres] = useState([]);

  const getSong = id => {
    SongDataService.get(id)
      .then(response => {
        var currentSong = response.data
        setSong(currentSong);
        //console.log("1.song.title="+ currentSong.title)
        var lyr = new LyricsWithChords(currentSong["lyric"].join('\n'));
        setLyrics(lyr)
       // console.log("2.lyrics.lyric="+ lyr.lyric)
        //var trkeys = lyrics.getTransposalKeys()
       // setKeys(trkeys)
       // console.log("3.keys="+ lyr.getTransposalKeys())
      //  console.log("4. Chords used="+ Array.from(lyr.chordsUsed))
        setKey(lyr.getTransposalKeys()[6])
      //  var trkey = keys[6];
     //   console.log("4.key="+ trkeys[6])
        setTransposedLyrics(lyr.transpose(0))
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
      var idx = lyrics.getTransposalKeys().indexOf(e.target.value)-6
      setTransposedLyrics(lyrics.transpose(idx))
    }
   // console.log("new key=" + e.target.value )
   // setSearchCuisine(searchCuisine);
  };

  return (
    <div>
      {song ? (
        <div>
             
          <h5>{song.title} - {song.artist}</h5> 
          <Link to={"/songs/" + props.match.params.id + "/edit"} className="btn btn-primary">
            Edit
           </Link>
         <br/>
           <strong>Artist: </strong>{song.artist} <br/>
            <strong>Genre: </strong>{song.genre} 
            <div className="form-group">
              <strong><label for="lyrics"></label></strong>
            </div>            
            <div className="form-group">
               { lyrics ? (
                <div>
                 <Transpose keys={lyrics.getTransposalKeys()} selected={key} 
                  onKeyChange={onChangeKey}>
                 </Transpose>
                 <br/>
                 <ChordsList chords={lyrics.chordsUsed}/>
                 <br/> <br/>
                 <Lyrics text={transeposedLyrics}/>
                </div>
              ) : (
                <div></div>
              )}             
            </div>
          <YoutubeEmbed embedId={song.youtube}></YoutubeEmbed>
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