import React from 'react';
import './App.css';
import { helloWorld } from "library";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='./logo.svg' className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>ok!!</p>
        <div>{helloWorld()}</div>
      </header>
    </div>
  );
}

export default App;
