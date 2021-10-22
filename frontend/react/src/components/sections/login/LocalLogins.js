import React from "react";
import { getRoleLabel, getLocalUserName, roles } from "../../Utils/RoleHelper";
import { useDispatch } from "react-redux";
import { loadUser } from "../../../actions/initial";
import PropTypes from "prop-types";

function LocalLogins() {
  return (
    <div className="local-login">
      <h3 className="local-login-title">Local Login</h3>
      <section className="ds-l-container preview__grid">
        <div className="ds-l-row">
          <RenderLogins />
          <div className="ds-l-col--6">
            <div className="ds-u-justify-content--center ds-u-padding--1 ds-u-margin-y--2">
              <div className="ds-l-col--12">
                <button
                  onClick={() => oktaLogin()}
                  className="ds-c-button ds-c-button--primary"
                >
                  Okta Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function RenderLogins() {
  const roleTypes = roles.map((r) => r.value);
  return (
    <div className="ds-l-col--6">
      {roleTypes.map((r) => (
        <LoginAs key={r} role={r} />
      ))}
    </div>
  );
}

async function handleLogin(role, dispatch) {
  const localUserName = getLocalUserName(role);
  localStorage.setItem("loginInfo", `localLoggedin-${localUserName}`);
  dispatch(loadUser(localUserName));
}
function LoginAs({ role }) {
  const dispatch = useDispatch();
  return (
    <div className="ds-l-row">
      <div className="ds-u-justify-content--center ds-u-padding--1 ds-u-margin-y--2">
        <button
          onClick={() => handleLogin(role, dispatch)}
          className="ds-c-button ds-c-button--primary"
        >
          {getRoleLabel(role)}
        </button>
      </div>
    </div>
  );
}

function oktaLogin() {
  localStorage.setItem("loginInfo", "local-okta");
  window.location.reload();
}

LoginAs.propTypes = {
  role: PropTypes.object.isRequired,
};
export default LocalLogins;
