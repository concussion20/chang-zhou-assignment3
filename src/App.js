import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import axios from 'axios';
import Cookies from 'universal-cookie';

import {Login, Signup} from './components/Login';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import Home from './components/Home';
import Loggedin from './components/Loggedin';
import Settings from './components/Settings';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true


function App() {
  const cookies = new Cookies();
  let username = cookies.get('username')

  const navbarTabs = username ?    
    <ul className="flex flex-col lg:flex-row list-none ml-auto">
      <li className="nav-item">
        <Link to="/createpost" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
          Create Post
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/settings" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
          Settings
        </Link>
      </li>
    </ul>
    :
    <ul className="flex flex-col lg:flex-row list-none ml-auto">
      <li className="nav-item">
        <Link to="/signup" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
          Log In
        </Link>
      </li>
    </ul>

  return (
    <Router>
      <div id='app' className="grid grid-cols-6 gap-4">
        <div className="flex flex-wrap py-2 col-span-6">
          <div className="w-full px-4">
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-indigo-500 rounded">
              <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                  <Link to="/" className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white">
                    Hacky News
                  </Link>
                  <button className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
                    <span className="block relative w-6 h-px rounded-sm bg-white"></span>
                    <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                    <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                  </button>
                </div>
                <div className="flex lg:flex-grow items-center" id="example-navbar-info">
                  {navbarTabs}
                </div>
              </div>
            </nav>
          </div>
        </div>        

        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/settings" component={Loggedin(<Settings />)}>
          </Route>
          <Route path="/post/:postId">
            <Post />
          </Route>
          <Route path="/createpost" component={Loggedin(<CreatePost />)}>
          </Route>
          <Route path="/editpost/:postId" component={Loggedin(<CreatePost />)}>
          </Route>
          <Route path="/">
            <Home />
          </Route>   
        </Switch>
      </div>
    </Router>
  );

}

export default App;
