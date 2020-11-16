import React, { useState, useEffect, useRef } from "react";
import axios from "../../../authenticatedAxios";

/**
 * Display all users with options
 *
 *
 * @constructor
 */

const Users = () => {
  let data;
  useEffect(() => async(dispatch) => {
  dispatch({ type: "CONTENT_FETCHING_STARTED" });

  try {
    data = await axios.post(`/api/v1/userprofile/`);

  } catch (e) {
    console.log("Error pulling users data: ", e);
  }
  dispatch({type: "CONTENT_FETCHING_STARTED"})
  })

  console.log("zzjson", data);
let a =0;
  return (
    <div>
      Data: {data}
    </div>
  )

};

export default Users;
