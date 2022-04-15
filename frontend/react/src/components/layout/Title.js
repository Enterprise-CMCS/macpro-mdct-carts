import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Title = ({ name, formYear }) => (
  <div className="h1-title-report">
    <h1>
      {name} CARTS FY{formYear} Report
    </h1>
  </div>
);
Title.propTypes = {
  name: PropTypes.string.isRequired,
  formYear: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.stateUser.name,
  formYear: state.global.formYear,
});

export default connect(mapStateToProps)(Title);
