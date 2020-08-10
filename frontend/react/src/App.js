import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import Home from "./Home";
import Profile from './Profile';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

const CALLBACK_PATH = '/implicit/callback';

const config = {
  clientId: '0oa4juv4poiQ6nDB6297',
  issuer: 'https://test.idp.idm.cms.gov/oauth2/aus4itu0feyg3RJTK297',
  redirectUri: 'http://localhost:81/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

const App = () => { 
  return (
    <Router>
      <Security {...config}>
        <SecureRoute path="/" exact component={Home} />
        <Route path={CALLBACK_PATH} component={LoginCallback} />
        <SecureRoute path="/profile" component={Profile} />
      </Security>
    </Router>
  );
};

export default App;
