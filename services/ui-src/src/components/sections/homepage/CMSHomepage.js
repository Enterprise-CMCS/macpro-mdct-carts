import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStateStatuses } from "../../../actions/initial";
import ReportItem from "./ReportItem";
import { selectFormStatuses, selectYears } from "../../../store/selectors";
import { Button } from "@cmsgov/design-system";
import MultiSelect from "react-multi-select-component";
import { STATUS_MAPPING, UserRoles } from "../../../types";

const CMSHomepage = ({
  getStatuses,
  statuses,
  currentUserRole,
  stateList,
  yearList,
}) => {
  const statusList = [
    { label: "Accepted", value: "accepted" },
    { label: "Certified", value: "certified" },
    { label: "In Progress", value: "in_progress" },
    { label: "Not Started", value: "not_started" },
    { label: "Published", value: "published" },
  ];

  // using state below allows the user to keep both of the other filters working properly when they "remove" from a different drop down
  const [tempStates, setTempStates] = useState([]);
  const [tempStatuses, setTempStatus] = useState([]);
  const [tempYears, setTempYear] = useState([]);
  const [stateIds, setStateIds] = useState([]);
  const [yearIds, setYearIds] = useState([]);
  const [statusIds, setStatusIds] = useState([]);
  let tempHolder = [];
  useEffect(() => {
    getStatuses();
  }, []);
  const onSelectState = (element) => {
    tempHolder = element.map((state) => {
      return state.value;
    });
    setStateIds(tempHolder);
    setTempStates(element);
  };
  const onSelectYear = (element) => {
    tempHolder = element.map((year) => {
      return year.value;
    });
    setYearIds(tempHolder);
    setTempYear(element);
  };
  const onSelectStatus = (element) => {
    tempHolder = element.map((status) => {
      return status.value;
    });
    setStatusIds(tempHolder);
    setTempStatus(element);
  };

  const filterReports = () => {
    getStatuses(yearIds, stateIds, statusIds);
  };
  const clearFilter = () => {
    window.location.reload(false);
  };

  return (
    <div className="homepage ds-l-col--12">
      <div className="ds-l-container-large">
        {currentUserRole !== UserRoles.ADMIN ? (
          <>
            <div className="ds-l-row ds-u-padding-left--2">
              <h1 className="page-title ds-u-margin-bottom--0">
                CHIP Annual Report Template System (CARTS)
              </h1>
            </div>
            <div className="page-info ds-u-padding-left--2">
              <div className="edit-info">CMS user</div>
            </div>
          </>
        ) : null}
        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row filter-container">
                <div className="filter-div">
                  <div className="ds-c-label">Search and Filter results</div>

                  <div className="filter-drop-down-state">
                    <MultiSelect
                      options={stateList}
                      value={tempStates}
                      onChange={onSelectState}
                      labelledBy={"State"}
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "State" }}
                    />
                  </div>
                  <div className="filter-drop-down-year-status">
                    <MultiSelect
                      options={yearList}
                      value={tempYears}
                      onChange={onSelectYear}
                      labelledBy={"Year"}
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "Year" }}
                    />
                  </div>
                  <div className="filter-drop-down-year-status">
                    <MultiSelect
                      options={statusList}
                      value={tempStatuses}
                      onChange={onSelectStatus}
                      labelledBy="Status"
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "Status" }}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      class="ds-c-button ds-c-button--primary filter-button"
                      onClick={() => filterReports()}
                    >
                      Filter
                    </Button>
                    <Button
                      type="button"
                      class="ds-c-button ds-c-button--primary filter-button"
                      onClick={() => clearFilter()}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
              <div className="ds-l-row">
                <legend className="ds-u-padding--2 ds-h3">All Reports</legend>
              </div>
              <div className="report-header ds-l-row">
                <div className="name ds-l-col--1">Year</div>
                <div className="name ds-l-col--2">Report</div>
                <div className="status ds-l-col--2">Status</div>
                <div className="name ds-l-col--3">Last Edited</div>
                <div className="actions ds-l-col--4">Actions</div>
              </div>
              <div className="report-status">
                {statuses
                  // if there is a difference in year, sort by year first, otherwise, sort by state
                  .sort(
                    (a, b) => b.year - a.year || (a.state < b.state ? -1 : 1)
                  )
                  .map(
                    ({
                      state,
                      stateCode,
                      status,
                      year,
                      username,
                      lastChanged,
                    }) => {
                      return (
                        <div>
                          {
                            // eslint-disable-next-line
                            // with statement below we don't get the three default records (username, status, and lastchanged)
                            stateCode !== "status" &&
                            stateCode !== "lastChanged" &&
                            stateCode !== "username" &&
                            stateCode !== undefined ? (
                              <ReportItem
                                key={stateCode}
                                link1URL={`/views/sections/${stateCode}/${year}/00/a`}
                                name={`${state}`}
                                year={year}
                                statusText={STATUS_MAPPING[status]}
                                editor="x@y.z"
                                userRole={currentUserRole}
                                username={username}
                                lastChanged={lastChanged}
                              />
                            ) : null
                          }
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
CMSHomepage.propTypes = {
  getStatuses: PropTypes.func.isRequired,
  statuses: PropTypes.object.isRequired,
  currentYear: PropTypes.object.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  stateList: PropTypes.object.isRequired,
  yearList: PropTypes.object.isRequired,
  reportState: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  statuses: selectFormStatuses(state),
  currentYear: state.global.formYear,
  stateList: state.allStatesData.map((element) => {
    return { label: element.name, value: element.code };
  }),
  currentUserRole: state.stateUser.currentUser.role,
  reportstate: state.reportStatus,
  yearList: selectYears(),
});

const mapDispatch = {
  getStatuses: getAllStateStatuses ?? {},
};

export default connect(mapState, mapDispatch)(CMSHomepage);
