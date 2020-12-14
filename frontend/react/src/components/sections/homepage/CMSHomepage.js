import React, { useEffect , getState, useState} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStateStatuses } from "../../../actions/initial";
import ReportItem from "./ReportItem";
import { selectFormStatuses } from "../../../store/selectors";
import { Multiselect } from 'multiselect-react-dropdown';
import { Button } from "@cmsgov/design-system-core";


<<<<<<< HEAD
const CMSHomepage = ({
  getStatuses,
  statuses,
  currentYear,
  currentUserRole,
  stateList,
}) => {
    const [yearList, setYearList] = useState()
    const statusList = [
      { label:"Accepted", id: "accepted" },
      { label:"Certified", id: "certified" },
      { label:"In progress", id: "in_progress" },
      { label:"Not started", id: "not_started" },
      { label:"Published", id: "published" },
      { label:"Submitted", id: "submitted" },
      { label:"Uncertified", id: "uncertified" }
  ]
    // using state below allows the user to keep both of the other filters working properly when they "remove" from a different drop down
    let [tempStates, settempStates] = useState();
    let [tempStatus, settempStatus] = useState();
    let [tempYear, settempYear] = useState();
    let selectedStates = []
    let selectedYears = []
    let selectedStatuses = []
=======
const CMSHomepage = ({ getStatuses, statuses, currentYear }) => {
>>>>>>> 8ef7a122f113eb5559a18e99b15d6f4f520e45b5
  useEffect(() => {
    let yearArray = []  
    for (let x = 2020; x <= 2022; x++)// 2020 is the first year the new CARTS was used so there won't be an < 2020 forms
    {
      yearArray.push({ label: x.toString(), id: x })
    }
    setYearList(yearArray)
    getStatuses();
  }, []);

  

  const onSelectState = (element) => {
    selectedStates = element.map((state) => {return state.id})
    settempStates(selectedStates)
}
  const onSelectYear = (element) => {
    selectedYears = element.map((year) => {return year.id})
    settempYear(selectedYears)
}
  const onSelectStatus = (element) => {
  selectedStatuses = element.map((status) => {return status.id})
  settempStatus(selectedStatuses)
}

  const filterReports = () => {
    getStatuses(tempYear,tempStates, tempStatus)
  }
  const clearFilter = () => {
    window.location.reload(false);
  }

  return (
    <div className="homepage ds-l-col--12">
      <div className="ds-l-container-large">
        <div className="ds-l-row ds-u-padding-left--2">
          <h1 className="page-title ds-u-margin-bottom--0">
            CHIP Annual Report Template System (CARTS)
          </h1>
        </div>
        <div className="page-info ds-u-padding-left--2">
          <div className="edit-info">CMS user</div>
        </div>

        <div className="ds-l-row">
          <div className="reports ds-l-col--12">
            <div className="carts-report preview__grid">
              <div className="ds-l-row filter-container">  
              <div>
                <div className="ds-c-label">
                  Search and Filter results
                </div>
                
                  <div className="filter-drop-down-state">
                    <Multiselect
                    options={stateList}
                    onSelect={(element)=> onSelectState(element)}
                    onRemove={(element)=> onSelectState(element)}
                    displayValue="label" 
                    placeholder="State"
                    />
                  </div>
                  <div className="filter-drop-down-year-status">
                  <Multiselect

                    options={yearList}
                    onSelect={(element)=> onSelectYear(element)} 
                    onRemove={(element)=> onSelectYear(element)} 
                    displayValue="label" 
                    placeholder="Year"
                    showCheckbox={true}
                    />
                  </div>
                  <div className="filter-drop-down-year-status">
                  <Multiselect
                    options={statusList}
                    onSelect={(element)=> onSelectStatus(element)} 
                    onRemove={(element)=> onSelectStatus(element)} 
                    displayValue="label" 
                    placeholder="Status"
                    showCheckbox={true}
                    />
                  </div>
                  <div>
                    <Button 
                      type="button"
                      class="ds-c-button ds-c-button--primary filter-button"
                      onClick={() => filterReports()}>Filter</Button>
                      <Button 
                      type="button"
                      class="ds-c-button ds-c-button--primary filter-button"
                      onClick={() => clearFilter()}>Clear</Button>
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
                .sort((a, b) => (a.lastChanged > b.lastChanged ? -1 : 1))
                .map(({ state, stateCode, status, year, username, lastChanged }) => { 
                  return(
                    <div>
                      {
                  // with statement below we don't get the three default records (username, status, and lastchanged)
                  stateCode !== "status" && stateCode !== "lastChanged" && stateCode !== "userName" && stateCode !== undefined  ? (
                    <ReportItem
                      key={stateCode}
                      link1URL={`/views/sections/${stateCode}/${year}/00/a`}
                      name={`${state}`}
                      year={year}
                      statusText={status}
                      editor="x@y.z"
                      userRole={currentUserRole}
                      username={username}
                      lastChanged={lastChanged}
                    />
                  ) : null
                }
                  </div>
                )})}
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
};

const mapState = (state) => ({
  statuses: selectFormStatuses(state),
  currentYear: state.global.formYear,
<<<<<<< HEAD
  stateList: state.allStatesData.map((element) => {
    return { label: element.name, id: element.code };
  }),
  currentUserRole: state.stateUser.currentUser.role,
  reportstate: state.reportStatus
=======
>>>>>>> 8ef7a122f113eb5559a18e99b15d6f4f520e45b5
});

const mapDispatch = {
  getStatuses: getAllStateStatuses ?? {},
};

export default connect(mapState, mapDispatch)(CMSHomepage);
