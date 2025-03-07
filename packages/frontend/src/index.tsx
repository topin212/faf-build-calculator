import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/MainContent.css';

import reportWebVitals from './reportWebVitals';
import { NavigationBar } from "./components/Navbar"
import 'bootstrap/dist/css/bootstrap.min.css';
import {ProjectRouter} from './components/Router';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NavigationBar />
    
    <div className="App">
      <ProjectRouter />
    </div>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
