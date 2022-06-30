import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStateStatuses } from "../../../actions/initial";
import ReportItem from "./ReportItem";
import { selectFormStatuses, selectYears } from "../../../store/selectors";
import { Button } from "@cmsgov/design-system";
import { MultiSelect } from "react-multi-select-component";
import { STATUS_MAPPING, AppRoles } from "../../../types";

const CMSHomepage = ({
  getStatuses,
  allStateStatuses,
  currentUserRole,
  stateList,
  yearList,
}) => {
  const statusList = [
    { label: "Certified", value: "certified" },
    { label: "In Progress", value: "in_progress" },
    { label: "Not Started", value: "not_started" },
  ];

  const [currentlySelectedStates, setCurrentlySelectedStates] = useState([]);
  const [currentlySelectedStatuses, setCurrentlySelectedStatuses] = useState(
    []
  );
  const [currentlySelectedYears, setCurrentlySelectedYears] = useState([]);
  const [stateIds, setStateIds] = useState([]);
  const [yearIds, setYearIds] = useState([]);
  const [statusIds, setStatusIds] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);

  useEffect(() => {
    getStatuses();
    setFilteredStatuses(allStateStatuses);
  }, []);

  const onSelectState = (selectedValues) => {
    const selectedStateCodes = selectedValues.map((state) => {
      return state.value;
    });
    setStateIds(selectedStateCodes);
    setCurrentlySelectedStates(selectedValues);
  };

  const onSelectYear = (selectedValues) => {
    const selectedYears = selectedValues.map((year) => {
      return year.value;
    });
    setYearIds(selectedYears);
    setCurrentlySelectedYears(selectedValues);
  };

  const onSelectStatus = (selectedValues) => {
    const selectedStatuses = selectedValues.map((status) => {
      return status.value;
    });
    setStatusIds(selectedStatuses);
    setCurrentlySelectedStatuses(selectedValues);
  };

  const filterReports = () => {
    let yearFilter = () => {};
    let stateFilter = () => {};
    let statusFilter = () => {};

    yearIds.length > 0
      ? (yearFilter = (record) => yearIds.includes(record.year))
      : (yearFilter = () => true);

    stateIds.length > 0
      ? (stateFilter = (record) => stateIds.includes(record.stateCode))
      : (stateFilter = () => true);

    statusIds.length > 0
      ? (statusFilter = (record) => statusIds.includes(record.status))
      : (statusFilter = () => true);

    const withFilters = allStateStatuses
      .filter(yearFilter)
      .filter(stateFilter)
      .filter(statusFilter);

    setFilteredStatuses(withFilters);
  };

  const clearFilter = () => {
    setFilteredStatuses(allStateStatuses);
    setStatusIds([]);
    setCurrentlySelectedStatuses([]);
    setYearIds([]);
    setCurrentlySelectedYears([]);
    setStateIds([]);
    setCurrentlySelectedStates([]);
  };

  let stateStatuses;

  if (
    filteredStatuses.length > 0 &&
    filteredStatuses[0].stateCode === "status"
  ) {
    stateStatuses = allStateStatuses;
  } else {
    stateStatuses = filteredStatuses;
  }

  return (
    <div className="homepage ds-l-col--12">
      <div className="ds-l-container-large">
        {currentUserRole !== AppRoles.CMS_ADMIN ? (
          <div className="ds-l-row ds-u-padding-left--2">
            <h1 className="page-title ds-u-margin-bottom--0">
              CHIP Annual Reporting Template System (CARTS)
            </h1>
          </div>
        ) : null}
        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row filter-container">
                <div className="filter-div">
                  <div className="ds-c-label">Search and Filter results</div>

                  <div
                    data-cy="cms-homepage-state-dropdown"
                    className="filter-drop-down-state"
                  >
                    <MultiSelect
                      options={stateList}
                      value={currentlySelectedStates}
                      onChange={onSelectState}
                      labelledBy={"State"}
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "State" }}
                    />
                  </div>
                  <div
                    data-cy="cms-homepage-year-dropdown"
                    className="filter-drop-down-year-status"
                  >
                    <MultiSelect
                      options={yearList}
                      value={currentlySelectedYears}
                      onChange={onSelectYear}
                      labelledBy={"Year"}
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "Year" }}
                    />
                  </div>
                  <div
                    data-cy="cms-homepage-status-dropdown"
                    className="filter-drop-down-year-status"
                  >
                    <MultiSelect
                      options={statusList}
                      value={currentlySelectedStatuses}
                      onChange={onSelectStatus}
                      labelledBy="Status"
                      hasSelectAll={false}
                      overrideStrings={{ selectSomeItems: "Status" }}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      data-cy="cms-homepage-filter-submit"
                      class="ds-c-button ds-c-button--primary filter-button"
                      onClick={() => filterReports()}
                    >
                      Filter
                    </Button>
                    <Button
                      type="button"
                      data-cy="cms-homepage-filter-clear"
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
              <div data-cy="cms-homepage-reports" className="report-status">
                {stateStatuses
                  .sort((a, b) => (a.lastChanged > b.lastChanged ? -1 : 1))
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
  allStateStatuses: PropTypes.object.isRequired,
  currentYear: PropTypes.object.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  stateList: PropTypes.object.isRequired,
  yearList: PropTypes.object.isRequired,
  reportState: PropTypes.object.isRequired,
};

const mapState = (state) => ({
  allStateStatuses: selectFormStatuses(state),
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
