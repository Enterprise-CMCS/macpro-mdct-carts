import React from "react";
import { useSelector, shallowEqual } from "react-redux";
//types
import PropTypes from "prop-types";

const Title = ({ urlStateName }) => {
  const [name, stateName, formYear] = useSelector(
    (state) => [
      state.stateUser.name,
      state.global.stateName,
      state.global.formYear,
    ],
    shallowEqual
  );
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
  formYear: PropTypes.number.isRequired,
};

export default Title;
