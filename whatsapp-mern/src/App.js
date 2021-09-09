import React from "react"
import './App.css';
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
    <div className="app">
        <Router>
          <div className="app__body">
          <Switch>
            <Route path="/rooms/:roomId">
              <Sidebar /> 
              <Chat />
            </Route>
            <Route path="/">  
            <Sidebar /> 
              <Chat/>
            </Route>
          </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App
