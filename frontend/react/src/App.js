import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import WrappedSecurity from "./wrapSecurity";

// Add comment to force build frontend (will revert)
function App() {
  return (
    <Router>
      <WrappedSecurity />
    </Router>
  );
}

export default App;
