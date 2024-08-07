import React from "react";
import { useSelector } from "react-redux";

const UserInfo = () => {
  const currentUser = useSelector((state) => state.stateUser.currentUser);
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
    <ul>
      {info.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

export default UserInfo;
