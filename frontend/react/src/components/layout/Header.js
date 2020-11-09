import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autosave from "./Autosave";
import Logout from "./Logout";

class Header extends Component {
  constructor() {
    super();

    this.toggleUserNav = this.toggleUserNav.bind(this);
  }

  // eslint-disable-next-line
  toggleUserNav(e) {
    e.preventDefault();

    document.getElementById("menu-block").classList.toggle("open");
    document.getElementById("nav-user").classList.toggle("open");

    // Close menu when leaving focus
    const root = document.getElementById("root");
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
    const { currentUser } = this.props;
    const { email } = currentUser;

    return (
      <div className="header" data-test="component-header">
        <div className="ds-l-container">
          <div className="ds-l-row header-row">
            <div className="site-title ds-l-col--4 ds-u-padding--2">
              <a href="/">Carts</a>
            </div>
            <div className="user-details ds-l-col--8 ds-u-padding--2">
              <div className="ds-l-row">
                <Autosave />
                <div className="nav-user" id="nav-user">
                  <ul className="user-email-button">
                    <li>
                      <a
                        href="#menu"
                        className="nav--dropdown__trigger"
                        onClick={this.toggleUserNav}
                      >
                        {email}
                      </a>
                    </li>
                  </ul>
                  <ul className="menu-block" id="menu-block">
                    <li className="helpdesk">
                      <a href="mailto:cartshelp@cms.hhs.gov">Helpdesk</a>
                    </li>

                    <li className="manage-account">
                      <a href="/user/profile">Manage account</a>
                    </li>

                    <li className="logout">
                      <Logout />
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

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(Header);
