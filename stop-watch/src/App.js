import React from 'react';
import logo from './logo.svg';
import './App.css';

import Timer from './Timer'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to Timer app built in React js</h2>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Timer start ={Date.now()}/>
      </header>
    </div>
  );
}

export default App;
