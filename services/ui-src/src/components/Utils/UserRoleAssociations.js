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
    const postData = {
      username: row.data.username.trim(),
      user_role: row.data.user_role.trim(),
    };
    postDataToEndpointWithToken(postData, "/role_user_assoc/");
  });
};

const handleOnError = (err, file, inputElem, reason) => {
  console.log(err, file, inputElem, reason); // eslint-disable-line no-console
};

const UserRoleAssociation = ({ currentUser }) => {
  const authorized = (
    <>
      <div>
        <p>
          The CSV must have a header row with <code>username</code> and{" "}
          <code>user_role</code> as the headers, in order. Each row must contain
          only two values. If you assign a role that the job codes for that user
          do not entitle them to, this will not work; use{" "}
          <a href="/role_jobcode_assoc">/role_jobcode_assoc</a> for that.
        </p>
        <p>A sample valid CSV would look like this:</p>
        <p>
          <pre>
            username,user_role
            <br />
            1234,bus_user
            <br />
            5678,admin_user
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

UserRoleAssociation.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
});

export default connect(mapStateToProps)(UserRoleAssociation);
