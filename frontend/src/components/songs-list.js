import React, { useState, useEffect } from "react";
import SongDataService from "../services/song";
import { Link } from "react-router-dom";

const SongsList = props => {
  const [songs, setSongs] = useState([]);
  const [searchTitle, setSearchTitle ] = useState("");
  const [searchArtist, setSearchArtist ] = useState("");
  const [searchGenre, setSearchGenre ] = useState("");
  const [genres, setGenres] = useState(["All genres"]);

  useEffect(() => {
    retrieveSongs();
    retrieveGenres();
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const onChangeSearchArtist = e => {
    const searchArtist = e.target.value;
    setSearchArtist(searchArtist);
  };

  const onChangeSearchGenre = e => {
    const searchGenre = e.target.value;
    setSearchGenre(searchGenre);
    
  };

  const retrieveSongs = () => {
    SongDataService.getAll()
      .then(response => {
        console.log(response.data);
        setSongs(response.data.songs);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveGenres = () => {
    SongDataService.getGenres()
      .then(response => {
       setGenres(["All genres"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveSongs();
  };

  const find = (query, by) => {
    SongDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setSongs(response.data.songs);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    find(searchTitle, "title")
  };

  const findByArtist = () => {
    find(searchArtist, "artist")
  };

  const findByGenre = () => {
    if (searchGenre == "All genres") {
      refreshList();
    } else {
      find(searchGenre, "genre")
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by artist"
            value={searchArtist}
            onChange={onChangeSearchArtist}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByArtist}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchGenre}>
             {genres.map(genre => {
               return (
                 <option value={genre}> {genre.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByGenre}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {songs.map((song) => {
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <p className="card-text">
                    <strong>Genre: </strong>{song.genre}<br/>
                    <strong>Artist: </strong>{song.artist}
                  </p>
                  <div className="row">
                  <Link to={"/songs/"+song._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongsList;