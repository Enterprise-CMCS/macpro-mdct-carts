import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "../../authenticatedAxios";
import Searchable from "react-searchable-dropdown";
import { TextField } from "@cmsgov/design-system-core";
/**
 * Add a new record to carts_api_rolefromusername & carts_api_statesfromusername so that the user can become a state_user.
 *
 * @param {object} currentUser
 * @param {Array} stateList
 */

const AddStateUser = ({ currentUser, stateList }) => {
  

  const addUser = async (stateId, userId) => {
    
    if( stateId !== undefined && userId != "" )
    {
      const xhrURL = [
        window.env.API_POSTGRES_URL,
        `/api/v1/addstateuser/${userId}/${stateId.value}`,
      ].join("");
      // eslint-disable-next-line
      const result = await axios.get(xhrURL).then(function (result2) {
        window.alert(result2.data.toString());
        window.location.reload(false);
      });
    }
    else{
      setError(true)
    }
    
  };

  const [userId, setUserId] = useState();
  const [stateId, setStateId] = useState();
  const [error, setError] = useState(false);
  
  const authorized =  (
    <>
      <div className="ds-base">
        <h1>Add State User</h1>
        <p>
          To add a state user, enter their EUA Id, select their state, and click
          Add User
        </p>
        {error && (
        <p className="error" id="Error">
          You must enter an EUA Id and select a state.
        </p>)}
        <div>
          <div className="eua-id">
            <TextField
              label="EUA Id:"
              onBlur={(e) => setUserId(e.target.value)}
              className="ds-c-field--small"
            ></TextField>
          </div>
          <div>
            State:
            <br />
            <Searchable
              options={stateList}
              placeholder="Select a State"
              //notFoundText="Not Found"
              onSelect={(option) => {
                setStateId(option);
              }}
            />
          </div>
          <br />
          <button className="btn btn-primary" onClick={() => addUser(stateId, userId)}>Add User</button>
        </div>
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
