import React from "react";
import { shallowEqual, useSelector } from "react-redux";

const Userinfo = () => {
  const currentUser = useSelector(
    (state) => state.stateUser.currentUser,
    shallowEqual
  );
  const info = Object.entries(currentUser).map(([key, value]) => {
    if (key === "state") {
      return (
        <span>
          <strong>state</strong>: {value.id} {value.name}
        </span>
      );
    }
    return (
      <span>
        <strong>{key}</strong>: {value}
      </span>
    );
  });
  return (
    <main className="main">
      <ul>
        {info.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </main>
  );
};

export default Userinfo;
