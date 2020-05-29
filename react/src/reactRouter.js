import React from "react";
import { Route } from "react-router-dom";
import Section2b from "./components/sections/Section2B";

const routes = (
  <Route>
    <Route exact path="/" component={Section2b} />
    {/* <Route exact path="/2b" component={} />
    <Route exact path="/3c" component={} /> */}
  </Route>
);

export default routes;
