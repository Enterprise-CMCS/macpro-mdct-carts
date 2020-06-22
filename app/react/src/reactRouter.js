import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Section2a from "./components/sections/section2a/Section2A";
import Section2b from "./components/sections/section2b/Section2B";
import Section3c from "./components/sections/section3c/Section3c";
import Homepage from "./components/sections/homepage/Homepage";
import Preamble from "./components/sections/Preamble";
import BasicInfo from "./components/sections/BasicInfo";

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Homepage} />
      <Route exact path="/preamble" component={Preamble} />
      <Route exact path="/basic-info" component={BasicInfo} />
      <Route exact path="/2a" component={Section2a} />
      <Route exact path="/2b" component={Section2b} />
      <Route exact path="/3c" component={Section3c} />
    </Switch>
  </Router>
);

export default Routes;
