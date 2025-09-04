import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button } from "@cmsgov/design-system";
import { MultiSelect } from "react-multi-select-component";
// components
import ReportItem from "./ReportItem";
import { DropdownOption } from "../../fields/DropdownOption";
// utils
import { getAllStateStatuses } from "../../../actions/initial";
import { selectFormStatuses, selectYears } from "../../../store/selectors";
// types
import { STATUS_MAPPING, AppRoles } from "../../../types";

const CMSHomepage = () => {
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

  const dispatch = useDispatch();
  const [allStateStatuses, stateList, currentUserRole, yearList] = useSelector(
    (state) => [
      selectFormStatuses(state),
      state.allStatesData.map((element) => {
        return { label: element.name, value: element.code };
      }),
      state.stateUser.currentUser.role,
      selectYears(state.global.currentYear),
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(getAllStateStatuses());
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
    filteredStatuses?.length > 0 &&
    filteredStatuses?.[0]?.stateCode === "status"
  ) {
    stateStatuses = allStateStatuses;
  } else {
    stateStatuses = filteredStatuses;
  }

  return (
    <div className="ds-l-container">
      <div className="ds-l-row">
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
                      <div className="ds-c-label">
                        Search and Filter results
                      </div>

                      <div
                        data-cy="cms-homepage-state-dropdown"
                        className="filter-drop-down-state"
                      >
                        <MultiSelect
                          options={stateList}
                          value={currentlySelectedStates}
                          onChange={onSelectState}
                          hasSelectAll={false}
                          overrideStrings={{ selectSomeItems: "State" }}
                          ItemRenderer={DropdownOption}
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
                          hasSelectAll={false}
                          overrideStrings={{ selectSomeItems: "Year" }}
                          ItemRenderer={DropdownOption}
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
                          hasSelectAll={false}
                          overrideStrings={{ selectSomeItems: "Status" }}
                          ItemRenderer={DropdownOption}
                        />
                      </div>
                      <div>
                        <Button
                          type="button"
                          data-cy="cms-homepage-filter-submit"
                          className="ds-c-button ds-c-button--solid filter-button"
                          onClick={() => filterReports()}
                        >
                          Filter
                        </Button>
                        <Button
                          type="button"
                          data-cy="cms-homepage-filter-clear"
                          className="ds-c-button ds-c-button--solid filter-button"
                          onClick={() => clearFilter()}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="ds-l-row">
                    <h2 id="reports-heading" className="ds-h3 ds-u-padding--2">
                      All Reports
                    </h2>
                  </div>
                  <div className="ds-l-row">
                    <div className="reports ds-l-col--12">
                      <table
                        className="carts-report preview__grid"
                        aria-labelledby="reports-heading"
                      >
                        <thead>
                          <tr className="report-header ds-l-row">
                            <th className="ds-l-col--1">Year</th>
                            <th className="ds-l-col--2">Report</th>
                            <th className="ds-l-col--2">Status</th>
                            <th className="ds-l-col--3">Last Edited</th>
                            <th className="ds-l-col--4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stateStatuses
                            ?.sort((a, b) =>
                              a.lastChanged > b.lastChanged ? -1 : 1
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
                                    {stateCode !== "status" &&
                                      stateCode !== "lastChanged" &&
                                      stateCode !== "username" &&
                                      stateCode !== undefined && (
                                        <ReportItem
                                          key={`${stateCode} - ${year}`}
                                          link1URL={`/views/sections/${stateCode}/${year}/00/a`}
                                          name={state}
                                          year={year}
                                          statusText={STATUS_MAPPING[status]}
                                          userRole={currentUserRole}
                                          username={username}
                                          lastChanged={lastChanged}
                                          stateAbbr={stateCode}
                                        />
                                      )}
                                  </div>
                                );
                              }
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSHomepage;
