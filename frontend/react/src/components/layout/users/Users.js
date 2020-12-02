import React, { useState, useEffect } from "react";
import axios from "../../../authenticatedAxios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Card from "@material-ui/core/Card";
import "react-data-table-component-extensions/dist/index.css";
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

  const loadUserData = async () => {
    dispatch({ type: "CONTENT_FETCHING_STARTED" });

    try {
      let { data } = await axios.post(`/api/v1/userprofiles`);
      setUsers(data);
    } catch (e) {
      console.log("Error pulling users data: ", e);
    }
    dispatch({ type: "CONTENT_FETCHING_FINISHED" });
  };

  useEffect(async () => {
    await loadUserData();
  }, []);

  const deactivateUser = async (e) => {
    const really = window.confirm(
      `Are you sure you want to deactivate user ${e}`
    );
    if (really) {
      axios.post(`/api/v1/user/deactivate/${e}`).then(async () => {
        await loadUserData();
      });
    }
  };

  const activateUser = async (e) => {
    const really = window.confirm(
      `Are you sure you want to activate user ${e}`
    );
    if (really) {
      axios.post(`/api/v1/user/activate/${e}`).then(async () => {
        await loadUserData();
      });
    }
  };

  let tableData = false;

  if (users) {
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
        sortable: true,
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        cell: function modifyEmail(e) {
          return (
            <span>
              <a href={`mailto:${e.email}`}>{e.email}</a>
            </span>
          );
        },
      },
      {
        name: "Role",
        selector: "user_role",
        sortable: true,
        cell: function Role(r) {
          if (r) {
            return r.user_role;
          } else {
            return "";
          }
        },
      },
      {
        name: "Joined",
        selector: "date_joined",
        sortable: true,
        cell: function modifyDateJoined(d) {
          if (d.date_joined) {
            return <span>{moment(d.date_joined).format("MM/DD/YYYY")}</span>;
          } else {
            return "";
          }
        },
      },
      {
        name: "Last Active",
        selector: "last_login",
        sortable: true,
        cell: function modifyLastLogin(l) {
          if (l.last_login) {
            return <span>{moment(l.last_login).format("MM/DD/YYYY")}</span>;
          } else {
            return "";
          }
        },
      },
      {
        name: "Created",
        selector: "date_joined",
        sortable: true,
        cell: function modifyDateJoined(l) {
          return <span>{moment(l.date_joined).format("MM/DD/YYYY")}</span>;
        },
      },
      {
        name: "States",
        selector: "state_codes",
        sortable: true,
        cell: function modifyStateCodes(s) {
          return s.state_codes ? (
            <span>{s.state_codes.sort().join(", ")}</span>
          ) : null;
        },
      },
      {
        name: "Status",
        selector: "is_active",
        sortable: true,
        cell: function modifyIsActive(s) {
          return (
            <span>
              {s.is_active ? (
                <button
                  className="btn btn-primary status"
                  onClick={() => deactivateUser(s.username)}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  className="btn btn-primary status"
                  onClick={() => activateUser(s.username)}
                >
                  Activate
                </button>
              )}
            </span>
          );
        },
      },
    ];

    tableData = {
      columns,
      data: users,
      exportHeaders: true,
    };
  }

  return (
    <div className="user-profiles">
      <h1>Users</h1>
      <Card>
        {tableData ? (
          <DataTableExtensions {...tableData}>
            <DataTable
              title="Users"
              defaultSortField="username"
              sortIcon={<SortIcon />}
              highlightOnHover
              selectableRows={false}
              responsive={true}
            />
          </DataTableExtensions>
        ) : null}
      </Card>
    </div>
  );
};

export default Users;
