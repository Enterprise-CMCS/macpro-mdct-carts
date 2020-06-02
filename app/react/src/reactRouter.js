import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Section2b from "./components/sections/Section2B";
import Section3c from "./components/sections/Section3c";
import Homepage from "./components/Homepage";

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/2b" component={Section2b} />
      <Route exact path="/3c" component={Section3c} />
    </Switch>
  </Router>
);

export default Routes;
