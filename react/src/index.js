import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import Section2b from "./components/sections/Section2B";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path='/' component={Section2b} />
    </Router>

    <App />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
