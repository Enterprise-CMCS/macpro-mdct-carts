import React, { useState, useEffect, useRef } from "react";
import axios from "../../../authenticatedAxios";
import { LOAD_SECTIONS, loadSections } from "../../../actions/initial";
import { useDispatch } from "react-redux";
import moment from "moment";
/**
 * Display all users with options
 *
 *
 * @constructor
 */

const Users = () => {
  const [users, setUsers] = useState();
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch({ type: "CONTENT_FETCHING_STARTED" });

    try {
      console.log("xxxxxxxxxxxxxxxxx");
      let { data } = await axios.post(`/api/v1/userprofiles`);
      console.log("zzjson", data);
      setUsers(data);
    } catch (e) {
      console.log("Error pulling users data: ", e);
      console.log("zzjson-failure");
    }
    dispatch({ type: "CONTENT_FETCHING_FINISHED" });
  }, []);

  let output = [];

  if (users) {
    for (const user of users) {
      // Split array into comma separated string
      const stateCodes = user.state_codes.join(", ");

      // Trim email for display
      // const email = user.email.substring(0, 18) + "..."
      const email = user.email;

      // Correct time
      const dateJoined = moment(user.date_joined).format("MM/DD/YYYY");

      // Set active/inactive
      const active = user.is_active ? "active" : "inactive";

      output.push(
        <li key={user.id}>
          <div class="username">{user.username}</div>
          <div class="name">
            {user.first_name} {user.last_name}
          </div>
          <div class="email">
            <a href={`mailto:${user.email}`}>{email}</a>
          </div>
          <div class="date_joined">{dateJoined}</div>
          <div class="user_role">{user.user_role}</div>
          <div class="state_codes">{stateCodes}</div>
          <div class="active">{active}</div>
        </li>
      );
    }
  }

  console.log("zzoutput", output);

  let a = 0;
  return (
    <div className="user-profiles">
      <h1>Users</h1>
      <ul>
        <li>
          <div className="label username">Username</div>
          <div className="label name">Name</div>
          <div className="label email">Email</div>
          <div className="label date_joined">Joined</div>
          <div className="label user_role">Role</div>
          <div className="label state_codes">State(s)</div>
          <div className="label active">Active</div>
        </li>
        {output}
      </ul>
    </div>
  );
};

export default Users;
