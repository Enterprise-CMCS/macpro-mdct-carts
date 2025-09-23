import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button } from "@cmsgov/design-system";
import { MultiSelect } from "react-multi-select-component";
// components
import ReportItemLinks from "./ReportItemLinks";
import SortableTable, { generateColumns } from "./SortableTable";
import { DropdownOption } from "../../fields/DropdownOption";
// types
import { AppRoles } from "../../../types";
// utils
import { getAllStateStatuses } from "../../../actions/initial";
import { selectFormStatuses, selectYears } from "../../../store/selectors";
import mapStatesData from "../../utils/mapStatesData";

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
    let yearFilter = () => true;
    let stateFilter = () => true;
    let statusFilter = () => true;

    if (yearIds.length > 0) {
      yearFilter = (record) => yearIds.includes(record.year);
    }

    if (stateIds.length > 0) {
      stateFilter = (record) => stateIds.includes(record.stateCode);
    }

    if (statusIds.length > 0) {
      statusFilter = (record) => statusIds.includes(record.status);
    }

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

  stateStatuses = stateStatuses
    .filter(
      (state) =>
        state &&
        !["status", "lastChanged", "username", undefined].includes(
          state.stateCode
        )
    )
    .sort((a, b) => new Date(b.lastChanged) - new Date(a.lastChanged));

  // Sortable table settings
  const data = useMemo(
    () => mapStatesData(stateStatuses, false),
    [stateStatuses]
  );

  const customCells = (headKey, value, originalRowData) => {
    const { entity } = originalRowData;
    const { stateCode, status, year } = entity;
    const actionLinkURL = `/views/sections/${stateCode}/${year}/00/a`;

    switch (headKey) {
      case "stateName":
      case "year": {
        return <span className="name">{value}</span>;
      }
      case "actions": {
        return (
          <ReportItemLinks
            actionLinkURL={actionLinkURL}
            stateCode={stateCode}
            status={status}
            userRole={currentUserRole}
            year={year}
          />
        );
      }
      default:
        return value;
    }
  };

  const sortableHeadRow = {
    year: { header: "Year" },
    stateName: { header: "Report" },
    statusText: { header: "Status" },
    lastEdited: { header: "Last Edited" },
    actions: { header: "Actions", sort: false },
  };

  const columns = generateColumns(sortableHeadRow, true, customCells);

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
                    <div className="reports">
                      <SortableTable
                        aria-labelledBy={"reports-heading"}
                        columns={columns}
                        data={data}
                      />
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
