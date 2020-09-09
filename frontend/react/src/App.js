import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router } from 'react-router-dom';
import WrappedSecurity from "./wrapSecurity";

function App() {
  return (
    <Router>
      <WrappedSecurity />
    </Router>
  );
}

export default App;
