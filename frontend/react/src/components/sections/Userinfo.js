import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

const Userinfo = ({ currentUser }) => {
  const info = Object.entries(currentUser).map(([key, value]) => {
    if (key === "state") {
      return (
        <span>
          <strong>state</strong>: {value.id} {value.name}
        </span>
      );
    } else {
      return (
        <span>
          <strong>{key}</strong>: {value}
        </span>
      );
    }
  });
  return (
    <ul>
      {info.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(Userinfo);
