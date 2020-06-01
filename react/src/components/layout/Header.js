import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className="header ds-l-container">
        <div class="ds-l-row">
          <div className="site-title ds-l-col--6">
            <a href="/">Carts</a>
          </div>
          <div className="user-details ds-l-col--6">
            <div className="save-status">Autosaved</div>
            <div className="nav-user">
              <ul>
                <li>
                  karen.dalton@state.gov
                  <ul>
                    <li className="manage-account">
                      <a href="#">Manage account</a>
                    </li>
                    <li className="logout">
                      <a href="#">Log out</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
