import React, { useState, useEffect, useRef } from "react";
import axios from "../../../authenticatedAxios";
import DataTable from "react-data-table-component";
import DataTableExtensions from 'react-data-table-component-extensions';
import Card from "@material-ui/core/Card";
import 'react-data-table-component-extensions/dist/index.css';
import SortIcon from "@material-ui/icons/ArrowDownward";
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

  const deactivateUser = (e) => {
    console.log("deactivateUser", e)
  }

  const activateUser = (e) => {
    console.log("activateUser", e)
  }

  let tableData;

  if(users) {

    // Build column structure for react-data-tables
    const columns = [
      {
        name: "Username",
        selector: "username",
        sortable: true,
      },
      {
        name: "First Name",
        selector: "first_name",
        sortable: true,
      },
      {
        name: "Last Name",
        selector: "last_name",
        sortable: true
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        cell: e => <span><a href={`mailto:${e.email}`}>{e.email}</a></span>
      },
      {
        name: "Joined",
        selector: "date_joined",
        sortable: true,
        cell: d => <span>{moment(d.date_joined).format("MM/DD/YYYY")}</span>
      },
      {
        name: "Last Active",
        selector: "last_login",
        sortable: true,
        cell: l => <span>{moment(l.last_login).format("MM/DD/YYYY")}</span>
      },
      {
        name: "States",
        selector: "state_codes",
        sortable: true,
        cell: s => <span>{s.state_codes.sort().join(', ')}</span>,
      },
      {
        name: "Active",
        selector: "is_active",
        sortable: true,
        cell: s => <span>{s.state_codes ? <button className="btn btn-primary" onClick={deactivateUser}>Deactivate</button>: <button className="btn btn-primary" onClick={activateUser}>Activate</button>}</span>,
      }
    ]

    tableData = {
      columns,
      data: users,
      exportHeaders: true,

    }
  }

  return (
    <div className="user-profiles">
      <h1>Users</h1>
      <Card>
        {tableData ?
        <DataTableExtensions
          {...tableData}
        >
        <DataTable
          title="Users"
          defaultSortField="username"
          sortIcon={<SortIcon />}
          selectableRows
          highlightOnHover
          selectableRows={false}
          responsive={true}
        />
        </DataTableExtensions>
          : null }
      </Card>
    </div>
  )
};

export default Users;
