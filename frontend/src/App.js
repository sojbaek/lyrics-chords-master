import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddSong from "./components/add-song";
import Song from "./components/songs";
import SongsList from "./components/songs-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/songs" className="navbar-brand">
          Lyrics and Chords
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/songs"} className="nav-link">
              Songs
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/songs"]} component={SongsList} />
          <Route 
            path="/songs/:id/review"
            render={(props) => (
              <AddSong {...props} user={user} />
            )}
          />
          <Route 
            path="/songs/:id"
            render={(props) => (
              <Song {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
