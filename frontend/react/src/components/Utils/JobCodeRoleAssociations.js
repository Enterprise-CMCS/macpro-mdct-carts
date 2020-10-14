import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CSVReader } from "react-papaparse";
import { useOktaAuth } from "@okta/okta-react";
import postDataToEndpointWithToken from "../../util/postDataToEndpointWithToken";

const buttonRef = React.createRef();

const handleOpenDialog = (e) => {
  if (buttonRef.current) {
    buttonRef.current.open(e);
  }
};

const handleOnFileLoad = (token, data) => {
  data.forEach((row) => {
    if (!row.data.job_code) {
      return;
    }
    const postData = {
      job_code: row.data.job_code.trim(),
      user_role: row.data.user_role.trim(),
    };
    postDataToEndpointWithToken(postData, "/role_assoc/", token);
  });
};

const handleOnError = (err, file, inputElem, reason) => {
  console.log(err, file, inputElem, reason); // eslint-disable-line no-console
};

const JobCodeRoleAssociation = ({ currentUser }) => {
  const { authState } = useOktaAuth();
  const wrappedHandle = (data) => {
    const { accessToken } = authState;
    handleOnFileLoad(accessToken, data);
  };
  const authorized = (
    <>
      <div>
        <p>
          The CSV must have a header row with <code>job_code</code> and{" "}
          <code>user_role</code> as the headers, in order. Each row must contain
          only two values. The role with the highest level of privileges will be
          assigned to a user if they have multiple job codes. In order to assign
          a role with lower privileges to a user, that job code must be
          associated with that role here (note that this affects all users with
          that job code) and the specific user must be associated with the role
          via <a href="/role_user_assoc">/role_user_assoc</a> for that
        </p>
        <p>A sample valid CSV would look like this:</p>
        <p>
          <pre>
            job_code,user_role
            <br />
            Job_Code_One,bus_user
            <br />
            JOB_CODE_TWO,admin_user
            <br />
          </pre>
        </p>
      </div>
      <div>
        <CSVReader
          ref={buttonRef}
          onFileLoad={wrappedHandle}
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

JobCodeRoleAssociation.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(JobCodeRoleAssociation);
