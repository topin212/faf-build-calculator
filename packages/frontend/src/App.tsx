import React from 'react';
import './styles/App.css';
import { helloWorld } from "library";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>{helloWorld()}</div>
      </header>
    </div>
  );
}

export default App;
