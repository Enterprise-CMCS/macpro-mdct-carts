import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { Button } from "@cmsgov/design-system";
import { useHistory } from "react-router-dom";
import { loadForm } from "../../actions/initial";
import { certifyAndSubmit } from "../../actions/certify";
import PageInfo from "./PageInfo";
import {
  getCurrentReportStatus,
  selectIsFormEditable,
} from "../../store/selectors";
import FormActions from "./FormActions";
import { UserRoles } from "../../types";

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
    <Button data-testid={"certifySubmit"} onClick={certify} variation="primary">
      Certify and Submit
    </Button>
  </>
);

Submit.propTypes = { certify: PropTypes.func.isRequired };

const Thanks = ({ done: doneDispatch, lastSave, user }) => {
  return (
    <>
      <h3 data-testid={"certifyThankYou"}>
        Thank you for submitting your CARTS report!
      </h3>
      <p>
        Submitted on {lastSave.format("MMMM Do, YYYY")} at{" "}
        {lastSave.format("h:mm A")} by {user}.
      </p>
      <h3>What to expect next</h3>
      <p>You‘ll hear from CMS if they have any questions about your report.</p>
      <Button onClick={doneDispatch} variation="primary">
        Return Home
      </Button>
    </>
  );
};

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
  currentUserRole,
  state,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(loadForm(state));
  }, [user]);

  const certify = () => {
    certifyAction();
  };

  const doneClick = () => {
    history.push("/");
    window.location.reload();
  };

  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        {currentUserRole === UserRoles.STATE && <h2>Certify and Submit</h2>}
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
  currentUserRole: PropTypes.string.isRequired,
};

CertifyAndSubmit.defaultProps = {
  user: null,
};

const mapState = (state) => ({
  isCertified: !selectIsFormEditable(state),
  lastSave: moment(getCurrentReportStatus(state).lastChanged),
  user: getCurrentReportStatus(state).username,
  currentUserRole: state.stateUser.currentUser.role,
  state: state.stateUser.abbr,
});

const mapDispatch = { certifyAndSubmit };

export default connect(mapState, mapDispatch)(CertifyAndSubmit);
