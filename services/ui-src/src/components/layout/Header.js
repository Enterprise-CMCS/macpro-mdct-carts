import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autosave from "./Autosave";
import Logout from "./Logout";
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
import { Link, withRouter } from "react-router-dom";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isMenuOpen: false,
    };
  }

  toggleDropDown = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  closeDropDown = () => {
    this.setState({
      isMenuOpen: false,
    });
  };

  componentDidUpdate() {
    const { isMenuOpen } = this.state;
    setTimeout(() => {
      if (isMenuOpen) {
        window.addEventListener("click", this.closeDropDown);
      } else {
        window.removeEventListener("click", this.closeDropDown);
      }
    }, 0);
  }

  render() {
    const { currentUser } = this.props;
    const { currentYear } = this.props;
    const { location } = this.props;
    const { email } = currentUser;
    const isLoggedIn = !!currentUser.username;
    const showAutoSave = location.pathname.includes("/views/sections/");
    const { isMenuOpen } = this.state;

    return (
      <div className="component-header" data-test="component-header">
        <UsaBanner
          data-testid={"usaBanner"}
          className={"usabanner-section-layout"}
        />
        <header className="header">
          <div className="ds-l-container">
            <div className="ds-l-row header-row">
              <div className="site-title ds-l-col--4 ds-u-padding--2">
                <Link data-testid={"cartsCurrentYear"} to="/">
                  Carts-{currentYear}
                </Link>
              </div>
              <div className="user-details ds-l-col--8 ds-u-padding--2">
                <div className="ds-l-row">
                  {showAutoSave && <Autosave />}
                  {isLoggedIn &&
                    renderDropDownMenu(isMenuOpen, this.toggleDropDown, email)}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
function renderDropDownMenu(isMenuOpen, toggleDropDown, email) {
  return (
    <div className="nav-user" id="nav-user">
      <ul className="user-email-button">
        <li>
          <a
            href="#menu"
            className="nav--dropdown__trigger"
            onClick={toggleDropDown}
          >
            {email}
            {isMenuOpen ? (
              <i class="fa fa-chevron-up" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-chevron-down" aria-hidden="true"></i>
            )}
          </a>
        </li>
      </ul>
      {isMenuOpen && (
        <ul className="menu-block open" id="menu-block">
          <li className="contact-us">
            <a href="mailto:mdct_help@cms.hhs.gov">Contact Us</a>
          </li>
          <li className="manage-account">
            <Link to="/user/profile">Manage Account</Link>
          </li>
          <li className="logout">
            <Logout />
          </li>
        </ul>
      )}
    </div>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentYear: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  currentYear: state.global.currentYear,
});

export default connect(mapStateToProps)(withRouter(Header));
