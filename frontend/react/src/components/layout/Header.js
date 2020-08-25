import React, { Component } from "react";
import { connect } from "react-redux";
import Autosave from './Autosave'

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
      <div className="header" data-test="component-header">
        <div className="ds-l-container">
          <div className="ds-l-row header-row">
            <div className="site-title ds-l-col--6 ds-u-padding--2">
              <a href="/">Carts</a>
            </div>
            <div className="user-details ds-l-col--6 ds-u-padding--2">
              <div className="ds-l-row">
                <Autosave />
                <div className="nav-user ds-l-col--6" id="nav-user">
                  <ul className="user-email-button">
                    <li>
                      <a
                        href="#menu"
                        className="nav--dropdown__trigger"
                        onClick={this.toggleUserNav}
                        data-test="component-header-username"
                      >
                        {this.props.currentUser.username}
                      </a>
                    </li>
                  </ul>
                  <ul className="menu-block" id="menu-block">
                    <li className="manage-account">
                      <a href="javascript:void(0)">Manage account</a>
                    </li>
                    <li className="logout">
                      <a href="javascript:void(0)">Log out</a>
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

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(Header);
