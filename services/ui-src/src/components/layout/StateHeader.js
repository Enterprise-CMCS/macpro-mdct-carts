import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const StateHeader = ({ imageURI, name }) => (
  <div className="state-header">
    <div className="state-image">
      <img src={imageURI} alt={name} />
    </div>
    <div className="state-name">{name}</div>
  </div>
);
StateHeader.propTypes = {
  imageURI: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  imageURI: state.stateUser.imageURI,
});

export default connect(mapStateToProps)(StateHeader);
