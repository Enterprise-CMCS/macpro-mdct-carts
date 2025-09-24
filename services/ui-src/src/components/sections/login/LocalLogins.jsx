import React, { useState } from "react";
import { useNavigate } from "react-router";
//components
import { AlertNotification } from "../../alerts/AlertNotification";
//utils
import { loginUser } from "../../../util/apiLib";
import { loginError } from "../../../verbiage/errors";
import { useFormFields } from "../../../hooks/useFormFields";

const LocalLogin = () => {
  const [error, setError] = useState(undefined);
  const navigate = useNavigate();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  async function handleLogin(event) {
    event.preventDefault();
    try {
      await loginUser(fields.email, fields.password);
      navigate("/");
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  return (
    <div className="login-option">
      <h2>Log In with Cognito</h2>
      {error && (
        <AlertNotification
          variation={loginError.variation}
          title={loginError.title}
          description={loginError.description}
          role=""
        />
      )}
      <form onSubmit={(event) => handleLogin(event)}>
        <label htmlFor="email">
          <p className="ds-c-field__hint">Email:</p>
          <input
            className="ds-c-field"
            type="email"
            id="email"
            name="email"
            value={fields.email}
            data-testid="login-email"
            onChange={handleFieldChange}
          />
        </label>
        <label htmlFor="password">
          <p className="ds-c-field__hint">Password:</p>
          <input
            className="ds-c-field"
            type="password"
            id="password"
            name="password"
            value={fields.password}
            data-testid="login-password"
            onChange={handleFieldChange}
          />
        </label>
        <br />
        <button
          className="ds-c-button ds-c-button--solid"
          type="submit"
          data-testid="login-button"
          data-cy="login-with-cognito-button"
        >
          Log In with Cognito
        </button>
      </form>
    </div>
  );
};

export const LocalLogins = ({ loginWithIDM }) => {
  return (
    <div className="local-login__wrapper .ds-l-col--12">
      <div>
        <h1 className=".ds-text-heading--xl">CARTS Developer Login</h1>
      </div>
      <div className="login-option">
        <h2>Log In with IDM</h2>
        <button
          className="ds-c-button ds-c-button--solid"
          onClick={loginWithIDM}
        >
          Login with IDM
        </button>
      </div>
      <hr />
      <LocalLogin />
    </div>
  );
};
