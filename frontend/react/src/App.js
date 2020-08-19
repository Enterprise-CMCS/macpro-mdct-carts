import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import Home from "./Home";
import config from './auth-config';

function App() {
  return (
    <Router>
      {/* OKTA Enabled */}
      {/* To enable OKTA Authentication, you will also need to go into layout > Header.js
      and ensure the Logout feature around Line 59 is uncommented */}
      {/* <Security {...config.oidc}>
        <SecureRoute path="/" component={Home} />
        <Route path={config.callback} component={LoginCallback} />
      </Security> */}

      {/* OKTA Disabled */}
      {/* To disable OKTA Authentication, you will also need to go into layout > Header.js
      and ensure the Logout feature around Line 59 is commented out*/}
      <Route component={Home} />

    </Router>
  );
}

export default App;
