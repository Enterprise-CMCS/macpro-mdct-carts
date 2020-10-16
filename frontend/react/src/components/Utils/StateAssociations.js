import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CSVReader } from "react-papaparse";
import postDataToEndpointWithToken from "../../util/postDataToEndpointWithToken";

const buttonRef = React.createRef();

const handleOpenDialog = (e) => {
  if (buttonRef.current) {
    buttonRef.current.open(e);
  }
};

const handleOnFileLoad = (data) => {
  data.forEach((row) => {
    if (!row.data.username) {
      return;
    }
    const stateCodes = row.data.state_codes
      .split(",")
      .map((code) => code.trim());
    postDataToEndpointWithToken(
      { username: row.data.username, state_codes: stateCodes },
      "/state_assoc/"
    );
  });
};

const handleOnError = (err, file, inputElem, reason) => {
  console.log(err, file, inputElem, reason); // eslint-disable-line no-console
};

const StateAssociation = ({ currentUser }) => {
  const authorized = (
    <>
      <div>
        <p>
          The CSV must have a header row with <code>username</code> and{" "}
          <code>state_codes</code> as the headers, in order. The values in
          state_codes must be a list of the two-digit state codes, separated by
          commas, and the entire list of state codes must be enclosed in
          quotation marks.
        </p>
        <p>A sample valid CSV would look like this:</p>
        <p>
          <pre>
            username,state_codes
            <br />
            1234,&quot;AK&quot;
            <br />
            5678,&quot;AZ,MA&quot;
            <br />
          </pre>
        </p>
      </div>
      <div>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          config={{ header: true }}
          noClick
          noDrag
        >
          {() => (
            <button type="button" onClick={handleOpenDialog}>
              Upload file
            </button>
          )}
        </CSVReader>
      </div>
    </>
  );
  const unauthorized = <p>You do not have access to this functionality.</p>;

  const userRole = currentUser.role;
  return userRole === "admin_user" ? authorized : unauthorized;
};

StateAssociation.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(StateAssociation);
