import './App.css';
import Home from "./Home";
import GoodLogin from "./GoodLogin";
import  {BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
   <Router>
     <div className = "App">
       <Switch>
        <Route path = "/" exact component ={Home}/>
        <Route path = "/home" component ={Home}/>
        <Route path = "/gLog" component ={GoodLogin}/>
       </Switch>

     </div>
   </Router>
  );
}

export default App;
