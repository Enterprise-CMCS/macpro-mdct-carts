import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Title = ({ name, stateName, formYear, urlStateName }) => {
  const displayStateName = name || urlStateName || stateName || "";

  return (
    <div className="h1-title-report" data-testid="report-title">
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
  formYear: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  stateName: state.global.stateName,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(Title);
