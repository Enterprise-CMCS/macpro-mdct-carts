import React from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useFormFields } from "../../../hooks/useFormFields";

const LocalLogin = () => {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  async function handleLogin() {
    try {
      await Auth.signIn(fields.email, fields.password);
      history.push(`/`);
    } catch (error) {
      console.log("Error while logging in.", error); // eslint-disable-line no-console
    }
  }

  return (
    <>
      <h1>Login with Cognito</h1>
      <h2>Email</h2>
      <input
        className="field"
        type="email"
        id="email"
        name="email"
        value={fields.email}
        data-testid="login-email"
        onChange={handleFieldChange}
      />
      <h2>Password</h2>
      <input
        className="field"
        type="password"
        id="password"
        name="password"
        value={fields.password}
        data-testid="login-password"
        onChange={handleFieldChange}
      />
      <br />
      <button
        colorScheme="teal"
        onClick={() => {
          handleLogin();
        }}
        isFullWidth
        data-testid="login-button"
        data-cy="login-with-cognito-button"
      >
        Login with Cognito
      </button>
    </>
  );
};

export const LocalLogins = ({ loginWithIDM }) => {
  return (
    <div className="local-login__wrapper">
      <div>
        <h1>Developer Login </h1>
        <br />
      </div>
      <div spacing={8}>
        <button onClick={loginWithIDM}>Login with IDM</button>
        <LocalLogin />
      </div>
    </div>
  );
};
