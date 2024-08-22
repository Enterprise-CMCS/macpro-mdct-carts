import React from "react";
import { useSelector } from "react-redux";

const StateHeader = () => {
  const { name, imageURI } = useSelector((state) => state.stateUser);

  return (
    <div
      className="state-header"
      data-testid="state-header"
      aria-label="State Header"
    >
      <div className="state-image">
        <img src={imageURI} alt={name} />
      </div>
      <div className="state-name">{name}</div>
    </div>
  );
};

export default StateHeader;
