import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { ApiProvider, UserProvider, useUser } from "./hooks/authHooks";

// Add comment to force build frontend (will revert)
function App() {
  // This is where the react app gets kickstarted!!!
  return (
    <div id="app-wrapper">
      <Router>
        <UserProvider>
          <ApiProvider>
            <AppRoutes />
          </ApiProvider>
        </UserProvider>
      </Router>
    </div>
  );
}
export default App;
