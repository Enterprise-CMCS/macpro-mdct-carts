import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import WrappedSecurity from "./wrapSecurity";
import config from './auth-config';

function App() {
  return (
    <Router>
      <WrappedSecurity />
    </Router>
  );
}

export default App;
