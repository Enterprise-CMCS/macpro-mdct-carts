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
  const dispatch = useDispatch();
  const [users, setUsers] = useState();
  const [sortType, setSortType] = useState();

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

  const reorderList = (type) => {
    setSortType(type);
  }

  let output = [];

  if (users) {

    // Sort data by selected value
    if(sortType == 'name') {
      users.sort((a, b) => (a.last_name.toLowerCase() > b.last_name.toLowerCase()) ? 1 : -1)
    }
    if(sortType == 'username') {
      users.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1)
    }
    if(sortType == 'email') {
      users.sort((a, b) => (a.email.toLowerCase() > b.email.toLowerCase()) ? 1 : -1)
    }
    if(sortType == 'joined') {
      users.sort((a, b) => (a.date_joined > b.date_joined) ? 1 : -1)
    }
    if(sortType == 'role') {
      users.sort((a, b) => (a.user_role.toLowerCase() > b.user_role.toLowerCase()) ? 1 : -1)
    }
    if(sortType == 'active') {
      users.sort((a, b) => (a.is_active > b.is_active) ? 1 : -1)
    }

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
            {user.last_name}, {user.first_name}
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
          <div className="label username"><button onClick={() => reorderList("username")}>Username</button></div>
          <div className="label name"><button onClick={() => reorderList("name")}>Name</button></div>
          <div className="label email"><button onClick={() => reorderList("email")}>Email</button></div>
          <div className="label date_joined"><button onClick={() => reorderList("joined")}>Joined</button></div>
          <div className="label user_role"><button onClick={() => reorderList("role")}>Role</button></div>
          <div className="label state_codes">State(s)</div>
          <div className="label active"><button onClick={() => reorderList("active")}>Active</button></div>
        </li>
        {output}
      </ul>
    </div>
  );
};

export default Users;
