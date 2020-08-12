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
      <Security {...config.oidc}>
        <SecureRoute path="/" component={Home} />
        <Route path={config.callback} component={LoginCallback} />
      </Security>
    </Router>
  );
}

export default App;
