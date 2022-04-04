import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './hooks/authHooks';
import AppRoutes from './AppRoutes';
import 'font-awesome/css/font-awesome.min.css';
import './styles/app.scss';

function App() {
  return (
    <div id="app-wrapper">
      <Router>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </Router>
    </div>
  );
}
export default App;
