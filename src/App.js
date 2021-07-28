import './App.css';
import Home from "./components/Home";
import Login from "./components/Login"
import MainQue from './components/MainQue';
import  {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ExistingQueue from './components/ExistingQueue';

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
