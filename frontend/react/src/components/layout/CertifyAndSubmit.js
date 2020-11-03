import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "@cmsgov/design-system-core";
import { useHistory } from "react-router-dom";
import { certifyAndSubmit } from "../../actions/certify";

import PageInfo from "./PageInfo";
import { selectIsFormEditable } from "../../store/selectors";
import FormActions from "./FormActions";

const Submit = ({ certify }) => (
  <>
    <h3>Ready to certify and submit?</h3>
    <p>
      Double check that everything in your CARTS report is accurate. You won’t
      be able to make any edits after submitting, unless you send a request to
      CMS to uncertify your report.
    </p>
    <p>
      Once you’ve reviewed your report, certify that it’s accurate and in
      compliance with Title XXI of the Social Security Act (Section 2109(a) and
      Section 2108(e)).
    </p>
    <Button onClick={certify} variation="primary">
      Certify and Submit
    </Button>
  </>
);
Submit.propTypes = { certify: PropTypes.func.isRequired };

const Thanks = ({ done: doneDispatch, lastSave, user }) => (
  <>
    <h3>Thank you for submitting your CARTS report!</h3>
    <p>
      Submitted on {lastSave.format("MMMM Do, YYYY")} at{" "}
      {lastSave.format("h:mm A")} by {user}.
    </p>
    <h3>What to expect next</h3>
    <p>You‘ll hear from CMS if they have any questions about your report.</p>
    <Button onClick={doneDispatch} variation="primary">
      Done
    </Button>
  </>
);
Thanks.propTypes = {
  done: PropTypes.func.isRequired,
  lastSave: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
};

const CertifyAndSubmit = ({
  certifyAndSubmit: certifyAction,
  isCertified,
  lastSave,
  user,
}) => {
  const history = useHistory();

  const certify = () => {
    certifyAction();
  };

  const doneClick = () => {
    history.push("/");
  };

  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2>Certify and Submit</h2>
        {isCertified ? (
          <Thanks done={doneClick} lastSave={lastSave} user={user} />
        ) : (
          <Submit certify={certify} />
        )}
      </div>
      <FormActions />
    </div>
  );
};
CertifyAndSubmit.propTypes = {
  certifyAndSubmit: PropTypes.func.isRequired,
  isCertified: PropTypes.bool.isRequired,
  lastSave: PropTypes.object.isRequired,
  user: PropTypes.oneOf([PropTypes.string, null]),
};
CertifyAndSubmit.defaultProps = {
  user: null,
};

const mapState = (state) => ({
  isCertified: !selectIsFormEditable(state),
  lastSave: moment(state.save.lastSave),
  user: state.reportStatus.userName,
});

const mapDispatch = { certifyAndSubmit };

export default connect(mapState, mapDispatch)(CertifyAndSubmit);
