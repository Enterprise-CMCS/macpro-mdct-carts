import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router-dom";
import Section2b from "./components/sections/Section2B";

const routes = (
  <Route>
    <Route exact path="/2b" component={Section2b} />
  </Route>
);

export default routes;
