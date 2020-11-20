import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "../../authenticatedAxios";
import Searchable from "react-searchable-dropdown";
import { TextField } from "@cmsgov/design-system-core";

const AddStateUser = ({ currentUser, stateList }) => {
  const addUser = async (stateId, userId) => {
    const xhrURL = [
      window.env.API_POSTGRES_URL,
      `/api/v1/addstateuser/${userId}/${stateId.value}`,
    ].join("");

    const result = await axios.get(xhrURL).then(function (result2) {
      // eslint-disable-line
      window.alert(result2.data.toString());
    });
  };

  const [userId, setUserId] = useState();
  const [stateId, setStateId] = useState();

  const authorized = (
    <>
      <div>
        <div>
          <Searchable
            value=""
            options={stateList}
            placeholder="Select a State"
            //notFoundText="Not Found"
            onSelect={(option) => {
              setStateId(option);
            }}
          />
        </div>
        <TextField onBlur={(e) => setUserId(e.target.value)}></TextField>
        <button onClick={() => addUser(stateId, userId)}>Add User</button>
      </div>
    </>
  );
  const unauthorized = <p>You do not have access to this functionality.</p>;

  const userRole = currentUser.role;
  return userRole === "admin_user" ? authorized : unauthorized;
};

AddStateUser.propTypes = {
  currentUser: PropTypes.object.isRequired,
  stateList: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  stateList: state.allStatesData.map((element) => {
    return { label: element.name, value: element.code };
  }),
});

export default connect(mapStateToProps)(AddStateUser);
