import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Title = ({ stateName, formYear, urlStateName }) => {
  let displayStateName = stateName;
  if (stateName === undefined && urlStateName !== undefined) {
    displayStateName = urlStateName;
  } else if (stateName === undefined && urlStateName === undefined) {
    displayStateName = "";
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
  stateName: PropTypes.string.isRequired,
  formYear: PropTypes.object.isRequired,
  urlStateName: PropTypes.object,
};

const mapStateToProps = (state) => ({
  stateName: state.global.stateName,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(Title);
