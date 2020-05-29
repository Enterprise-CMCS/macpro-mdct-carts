import React from "react";
import { Route } from "react-router-dom";
import Section2b from "./components/sections/Section2B";

const routes = (
  <Route>
    <Route exact path="/" component={Section2b} />
  </Route>
);

export default routes;
