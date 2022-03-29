import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/storeIndex";
import BrowserIssue from "./components/layout/BrowserIssue";

import App from "./App";

// Internet Explorer
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge
const isEdge = !isIE && !!window.StyleMedia;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {isIE || isEdge ? <BrowserIssue /> : <App />}
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
