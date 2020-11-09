import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "@cmsgov/design-system-core";
import { Link } from "react-router-dom";
import { theUncertify } from "../../../actions/uncertify";

const ReportItem = ({ link1Text, link1URL, name, statusText, statusURL, theUncertify: uncertifyAction }) => {
  const anchorTarget = link1Text === "Edit" ? "_self" : "_blank";
  const uncertify = () => {
    uncertifyAction();
  };

  return (
    <div className="report-item ds-l-row">
      <div className="name ds-l-col--2">{name}</div>
      <div
        className={`status ds-l-col--4 ${statusText === "Overdue" && `alert`}`}
      >
        {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
      </div>
      <div className="actions ds-l-col--6">
        <Link to={link1URL} target={anchorTarget}>
          {link1Text}
        </Link>
        {statusText === "Certified" ? (<Button onClick={uncertify} variation="primary">
          Uncertify
        </Button>) : null}

      </div>
    </div>
  );
};

ReportItem.propTypes = {
  uncertify: PropTypes.func.isRequired,
  link1Text: PropTypes.string,
  link1URL: PropTypes.string,
  name: PropTypes.string.isRequired,
  statusText: PropTypes.string,
  statusURL: PropTypes.string,
};
ReportItem.defaultProps = {
  link1Text: "View only",
  link1URL: "#",
  statusText: "Submitted",
  statusURL: "",

};


const mapState = (state) => ({
  user: state.reportStatus.userName,
});

const mapDispatch = { theUncertify };

export default connect(mapState, mapDispatch)(ReportItem);
