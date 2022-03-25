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
      console.log("Error while logging in.", error);
    }
  }

  return (
    <div>
      <h1 alignSelf="center">
        Login with Cognito
      </h1>
      <h2 mb="2" size="sm">
        Email
      </h2>
      <input
        className="field"
        type="email"
        id="email"
        name="email"
        value={fields.email}
        onChange={handleFieldChange}
      />
      <h2 mb="2" size="sm">
        Password
      </h2>
      <input
        className="field"
        type="password"
        id="password"
        name="password"
        value={fields.password}
        onChange={handleFieldChange}
      />
      <button
        colorScheme="teal"
        onClick={() => {
          handleLogin();
        }}
        isFullWidth
        data-cy="login-with-cognito-button"
      >
        Login with Cognito
      </button>
    </div>
  );
};

export const LocalLogins = ({ loginWithIDM }) => {
  return (
    <div maxW="sm" h="full" my="auto">
      <div textAlign="center" mb="6">
        <h1 mb="2" size="md" alignSelf="center">
          Developer Login{" "}
        </h1>
        <br />
      </div>
      <div spacing={8}>
        <button colorScheme="teal" onClick={loginWithIDM} isFullWidth>
          Login with IDM
        </button>
        <LocalLogin />
      </div>
    </div>
  );
};
