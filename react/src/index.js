<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Sidebar from "./components/Sidebar";
=======
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Route} from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from "./App";
>>>>>>> 716aea0594ef8b8125d73fff0601936bb1b3b7c6
import Section2b from "./components/sections/Section2B";
import { Provider } from "react-redux";
import { createStore } from "redux";
import routes from "./reactRouter";
import reducer from "./reducers/storeIndex";

const store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
<<<<<<< HEAD
    <Provider store={store}>
      <Router routes={routes} />
    </Provider>
=======
    <Router>
      <Route exact path='/' component={Section2b} />
    </Router>

    <App />

>>>>>>> 716aea0594ef8b8125d73fff0601936bb1b3b7c6
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
