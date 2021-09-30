import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LocalAuthenticatedRoute({ children, ...rest }) {
  const { pathname, search } = useLocation();
  const isAuthenticated = useSelector((state) => state.stateUser?.currentUser?.username);
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
}
