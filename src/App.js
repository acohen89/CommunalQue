import './App.css';
import Home from "./components/Home";
import GoodLogin from "./components/GoodLogin";
import Button from "./components/Button"
import Login from "./components/Login"
import MainQue from './components/MainQue';
import  {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ExistingQueue from './components/ExistingQueue';
const port = 3000;
const WEB_URL = "http://localhost:"  + port;
export {WEB_URL}; 
const CLIENT_ID = "35135547562945148a4c9129b244dfe8"; // Testing iD
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = WEB_URL + "/Home";
const SPACE_DELIMITER = "%20";
const SCOPES = [
 "playlist-modify-private",
 "playlist-modify-public",
 "playlist-read-private",
 "app-remote-control",
 "user-library-modify",
 "user-library-read",
 "user-read-private",
 "user-read-email"

];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

function App() {

  return (
   <Router>
     <div className = "App">
       <Switch>
        {<Route path = "/" exact component ={Login}/> }
        <Route path = "/home" component ={Home}/>
        <Route path = "/Queue" component ={MainQue}/>
        <Route path = "/JoinQueue" component={ExistingQueue}/>
       </Switch>

     </div>
   </Router>
  );
}

export default App;
