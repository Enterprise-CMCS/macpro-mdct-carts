import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "./hooks/authHooks";
import { PostLogoutRedirect } from "./components/layout/PostLogoutRedirect";
import AppRoutes from "./AppRoutes";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";

function App() {
  return (
    <div id="app-wrapper">
      <Router>
        <UserProvider>
          <AppRoutes />
          <Route path="postLogout" element={<PostLogoutRedirect />} />
        </UserProvider>
      </Router>
    </div>
  );
}
export default App;
