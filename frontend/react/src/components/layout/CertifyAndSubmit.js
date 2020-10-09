import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "@cmsgov/design-system-core";
import { certifyAndSubmit, done } from "../../actions/certify";

import PageInfo from "./PageInfo";

const Submit = ({ certify }) => (
  <>
    <h3>Ready to certify and submit?</h3>
    <p>
      Now that you‘ve reviewd your CARTS FFY 2020 report, certify that it‘s
      accurate and in compliance with Title XXI of the Social Security Act
      (Section 2109(a) and Section 2108(e)).
    </p>
    <Button onClick={certify} variation="primary">
      Certify and Submit
    </Button>
  </>
);
Submit.propTypes = { certify: PropTypes.func.isRequired };

const Thanks = ({ done: doneDispatch }) => (
  <>
    <h3>Thank you for submitting your CARTS report!</h3>
    <p>Submitted on [date] at [time] by [username].</p>
    <h3>What to expect next</h3>
    <p>You‘ll hear from CMS if they have any questions about your report.</p>
    <Button onClick={doneDispatch} variation="primary">
      Done
    </Button>{" "}
  </>
);
Thanks.propTypes = { done: PropTypes.func.isRequired };

const CertifyAndSubmit = ({
  certifyAndSubmit: certifyAction,
  done: doneAction,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const certify = () => {
    setSubmitted(true);
    certifyAction();
  };

  const doneClick = () => {
    setSubmitted(false);
    doneAction();
  };

  return (
    <div className="section-basic-info ds-l-col--9 content">
      <div className="main">
        <PageInfo />
        <h2>Certify and Submit</h2>
        {submitted ? <Thanks done={doneClick} /> : <Submit certify={certify} />}
      </div>
    </div>
  );
};
CertifyAndSubmit.propTypes = {
  certifyAndSubmit: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
};

const mapDispatchToProps = { certifyAndSubmit, done };

export default connect(null, mapDispatchToProps)(CertifyAndSubmit);
