import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "../../authenticatedAxios";
import Searchable from "react-searchable-dropdown";
import { TextField, Button } from "@cmsgov/design-system-core";
import MultiSelect from "react-multi-select-component";

/**
 * Add a new record to carts_api_rolefromusername & carts_api_statesfromusername so that the user
 * can become a state_user, co_user, bus_user, or admin_user.
 *
 * @param {object} currentUser
 * @param {Array} stateList
 */

const AddUser = ({ currentUser, stateList }) => {
  const addUser = async (stateId, userId, role) => {
    if (stateId !== undefined && userId != "") {
      const xhrURL = [
        window.env.API_POSTGRES_URL,
        `/api/v1/adduser/${userId}/${statesToSend}/${role}`,
      ].join("");
      // eslint-disable-next-line
      await axios.get(xhrURL).then(function (result2) {
        window.alert(result2.data.toString());
        window.location.reload(false);
      });
    } else {
      setError(true);
    }
  };

  const roles = [
    { value: "admin_user", label: "Admin User" },
    { value: "bus_user", label: "Business User" },
    { value: "co_user", label: "Central Office User" },
    { value: "state_user", label: "State User" },
  ];

  const [userId, setUserId] = useState();
  const [stateId, setStateId] = useState();
  const [statesToSend, setStatesToSend] = useState();
  const [role, setRole] = useState(null);
  const [error, setError] = useState(false);

  // Save selections for local use and API use
  const setStatesFromSelect = (option) => {
    // Save for multiselect use
    setStateId(option);

    // Save for API use
    let states = "";

    let first_iteration = true;
    // Create hyphen separated string of state abbreviations
    option.forEach((item) => {
      if (first_iteration) {
        states += item.value;
        first_iteration = false;
      } else {
        states += "-" + item.value;
      }
    });

    setStatesToSend(states);
  };

  const setRoleOnSelect = (option) => {
    setRole(option.value);

    // Clear States to prevent user error
    setStateId(null);
  };

  const authorized = (
    <>
      <div className="ds-base">
        <h1>Add User</h1>
        <p>
          To add a state user, enter their EUA Id, select their state, and click
          Add User.
        </p>
        <p className="note">
          Note: Users will not show up in the <a href="/users">User List</a>{" "}
          until they have logged in.
        </p>
        {error && (
          <p className="error" id="Error">
            You must enter an EUA Id, and select a role and state(s).
          </p>
        )}
        <div>
          <div className="eua-id">
            <TextField
              label="EUA Id:"
              onBlur={(e) => setUserId(e.target.value)}
              className="ds-c-field--small"
            ></TextField>
          </div>
          <div className="role">
            Role:
            <br />
            <Searchable
              options={roles}
              placeholder="Select a Role"
              onSelect={setRoleOnSelect}
            />
          </div>
          <div>
            {role == "state_user" ? (
              <>
                State:
                <br />
                <Searchable
                  options={stateList}
                  multiple={true}
                  placeholder="Select a State"
                  onSelect={(option) => {
                    // Set for searchable use
                    setStateId(option);
                    // Set for sending to API
                    setStatesToSend(option.value);
                  }}
                />
              </>
            ) : null}
            {role !== "state_user" && role !== null ? (
              <>
                States:
                <br />
                <MultiSelect
                  options={stateList}
                  value={stateId}
                  onChange={setStatesFromSelect}
                  labelledBy={"Select States"}
                  multiple={false}
                />
              </>
            ) : null}
          </div>
          <br />
          <Button
            type="button"
            class="ds-c-button ds-c-button--primary"
            onClick={() => addUser(stateId, userId, role)}
          >
            Add User
          </Button>
        </div>
      </div>
    </>
  );
  const unauthorized = <p>You do not have access to this functionality.</p>;

  const userRole = currentUser.role;
  return userRole === "admin_user" ? authorized : unauthorized;
};

AddUser.propTypes = {
  currentUser: PropTypes.object.isRequired,
  stateList: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  stateList: state.allStatesData.map((element) => {
    return { label: element.name, value: element.code };
  }),
});

export default connect(mapStateToProps)(AddUser);
