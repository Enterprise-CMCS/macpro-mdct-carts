import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import Home from "./Home";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

const CALLBACK_PATH = '/implicit/callback';

const config = {
  clientId: '0oaokz2apFWZl91724x6',
  issuer: 'https://astrolabe.okta.com/oauth2/default',
  redirectUri: 'http://localhost:81/implicit/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

const App = () => { 
  return (
    <Router>
      <Security {...config}>
        <Route path="/" exact component={Home} />
        <Route path="/implicit/callback" component={LoginCallback} />
      </Security>
    </Router>
  );
};

export default App;
