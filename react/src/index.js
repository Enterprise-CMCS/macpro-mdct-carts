import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Section2b from "./components/sections/Section2B";
import { Provider } from "react-redux";
import { createStore } from "redux";
import routes from "./reactRouter";
import reducer from "./reducers/storeIndex";

const store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router routes={routes} />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
