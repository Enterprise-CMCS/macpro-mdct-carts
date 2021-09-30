import React from "react";
import { getRoleLabel, roles } from "../../Utils/RoleHelper";
import { default as users } from "./localUsers.json";
import { useDispatch } from "react-redux";
import { loadUser } from "../../../actions/initial";

function LocalLogins() {
  const dispatch = useDispatch();

  async function handleLogin(role, users) {
    const data = users.filter((user) => user.currentUser.role === role)[0];
    localStorage.setItem(
      "loginInfo",
      `localLoggedin-${data.currentUser.username}`
    );
    dispatch(loadUser(data.currentUser.username));
  }

  function loginAs(role) {
    return (
      <div className="ds-l-row">
        <div className="ds-u-justify-content--center ds-u-padding--1 ds-u-margin-y--2">
          <button
            onClick={() => handleLogin(role, users)}
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

  return (
    <div className="local-login">
      <h3 className="local-login-title">Local Login</h3>
      <section className="ds-l-container preview__grid">
        <div className="ds-l-row">
          <div className="ds-l-col--6">
            {loginAs(roles.admiUser)}
            {loginAs(roles.businessUser)}
            {loginAs(roles.centralOfficeUser)}
            {loginAs(roles.stateUser)}
          </div>
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

export default LocalLogins;
