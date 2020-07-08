import React, { Component } from "react";

class Header extends Component {
  constructor() {
    super();

    this.toggleUserNav = this.toggleUserNav.bind(this);
  }

  toggleUserNav(e) {
    e.preventDefault();
    document.getElementById("menu-block").classList.toggle("open");
    document.getElementById("nav-user").classList.toggle("open");

    // Close menu when leaving focus
    let root = document.getElementById("root");
    root.addEventListener(
      "click",
      () => {
        document.getElementById("menu-block").classList.remove("open");
        document.getElementById("nav-user").classList.remove("open");
      },
      false
    );
  }

  render() {
    return (
      <div className="header">
        <div className="ds-l-container">
          <div className="ds-l-row header-row">
            <div className="site-title ds-l-col--6 ds-u-padding--2">
              <a href="/">Carts</a>
            </div>
            <div className="user-details ds-l-col--6 ds-u-padding--2">
              <div className="ds-l-row">
                <div className="save-status ds-l-col--6">Autosaved</div>
                <div className="nav-user ds-l-col--6" id="nav-user">
                  <ul className="user-email-button">
                    <li>
                      <a href="#menu" onClick={this.toggleUserNav.bind(this)}>
                        karen.dalton@state.gov
                      </a>
                    </li>
                  </ul>
                  <ul className="menu-block" id="menu-block">
                    <li className="manage-account">
                      <a href="#">Manage account</a>
                    </li>
                    <li className="logout">
                      <a href="#">Log out</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
