import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autosave from "./Autosave";
import Logout from "./Logout";
import UsaBanner from "@cmsgov/design-system/dist/components/UsaBanner/UsaBanner";
import { Link, withRouter } from "react-router-dom";
import { getCurrentReportStatus } from "../../store/selectors";
import { REPORT_STATUS, UserRoles } from "../../types";
import appLogo from "../../assets/images/MDCT_CARTS_2x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faUser } from "@fortawesome/free-solid-svg-icons";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isMenuOpen: false,
    };
  }

  toggleDropDownMenu = () => {
    this.setState((prevState) => ({
      isMenuOpen: !prevState.isMenuOpen,
    }));
  };

  closeDropDownMenu = () => {
    this.setState({
      isMenuOpen: false,
    });
  };

  showAutoSaveOnReport = (location, currentUser, reportStatus) => {
    const { role } = currentUser;
    if (location.pathname.includes("/sections/") && role === UserRoles.STATE) {
      switch (reportStatus.status) {
        case REPORT_STATUS.not_started:
        case REPORT_STATUS.in_progress:
        case REPORT_STATUS.uncertified:
          return true;
        default:
          return false;
      }
    }
    return false;
  };

  componentDidUpdate() {
    const { isMenuOpen } = this.state;
    setTimeout(() => {
      if (isMenuOpen) {
        window.addEventListener("click", this.closeDropDownMenu);
      } else {
        window.removeEventListener("click", this.closeDropDownMenu);
      }
    }, 0);
  }

  render() {
    const { currentUser } = this.props;
    const { reportStatus } = this.props;
    const { location } = this.props;
    const isLoggedIn = !!currentUser.username;
    const { isMenuOpen } = this.state;
    const shouldShowAutosave = this.showAutoSaveOnReport(
      location,
      currentUser,
      reportStatus
    );

    return (
      <div className="component-header" data-test="component-header">
        <UsaBanner
          data-testid={"usaBanner"}
          className={"usabanner-section-layout"}
        />
        <header className="header">
          <div className="ds-l-container">
            <div className="ds-l-row header-row">
              <div className="site-title ds-l-col--4 ds-u-padding-x--2 ds-u-padding-top--1">
                <Link to="/" className="ds-u-display--block">
                  <img
                    id="carts-logo"
                    src={appLogo}
                    alt="Logo for Medicaid Data Collection Tool (MDCT): CHIP Annual Reporting Template System (CARTS)"
                  />
                </Link>
              </div>
              <div className="user-details ds-l-col--8">
                <div
                  className="user-details-container ds-l-row"
                  data-testid={"userDetailsRow"}
                >
                  <div className="get-help-container">
                    <Link to="/" className="ds-u-display--block">
                      <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
                      Get Help
                    </Link>
                  </div>
                  {isLoggedIn &&
                    renderDropDownMenu(isMenuOpen, this.toggleDropDownMenu)}
                </div>
              </div>
            </div>
          </div>
        </header>
        {shouldShowAutosave && (
          <div className="save-container">
            <div className="ds-l-container">
              <div className="ds-l-row header-row">
                <div className="ds-l-col--12 ds-u-padding--2">
                  <Autosave />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
function renderDropDownMenu(isMenuOpen, toggleDropDownMenu) {
  return (
    <div className="nav-user" id="nav-user" data-testid="headerDropDownMenu">
      <ul className="user-email-button">
        <li>
          <a
            data-testid={"headerDropDownMenuButton"}
            href="#menu"
            onClick={toggleDropDownMenu}
          >
            <FontAwesomeIcon icon={faUser} size="lg" />
            My Account
            {isMenuOpen ? (
              <i
                data-testid="headerDropDownChevUp"
                className="fa fa-chevron-up"
                aria-hidden="true"
              ></i>
            ) : (
              <i
                data-testid="headerDropDownChevDown"
                className="fa fa-chevron-down"
                aria-hidden="true"
              ></i>
            )}
          </a>
        </li>
      </ul>
      {isMenuOpen && (
        <ul
          data-testid="headerDropDownLinks"
          className="menu-block open"
          id="menu-block"
        >
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
  reportStatus: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  reportStatus: getCurrentReportStatus(state),
});

export default connect(mapStateToProps)(withRouter(Header));
