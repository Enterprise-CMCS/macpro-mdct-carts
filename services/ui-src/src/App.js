import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import WrappedSecurity from "./wrapSecurity";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";

function App() {
  return (
    <Router>
      <WrappedSecurity />
    </Router>
  );
}
export default App;
