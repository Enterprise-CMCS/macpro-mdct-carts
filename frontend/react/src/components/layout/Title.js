import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Title = ({ name, stateName, formYear, urlStateName }) => {
  let displayStateName = "";
  if (name !== undefined && name !== null) {
    displayStateName = name;
  } else if (urlStateName !== undefined && urlStateName !== null) {
    displayStateName = urlStateName;
  } else if (stateName !== undefined && stateName !== null) {
    displayStateName = stateName;
  }

  return (
    <div className="h1-title-report">
      <h1>
        {displayStateName} CARTS FY{formYear} Report
      </h1>
    </div>
  );
};
Title.propTypes = {
  name: PropTypes.string,
  stateName: PropTypes.string,
  urlStateName: PropTypes.string,
  formYear: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  stateName: state.global.stateName,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(Title);
