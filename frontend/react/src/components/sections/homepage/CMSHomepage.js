import React, { useEffect , getState, useState} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStateStatuses } from "../../../actions/initial";
import ReportItem from "./ReportItem";
import { selectFormStatuses } from "../../../store/selectors";
import { Multiselect } from 'multiselect-react-dropdown';
import { Button } from "@cmsgov/design-system-core";

const CMSHomepage = ({
  getStatuses,
  statuses,
  currentYear,
  currentUserRole,
  stateList,
}) => {
    const [yearList, setYearList] = useState()
    const statusList = [
      { label:"Approved", id: "approved" },
      { label:"Certified", id: "certified" },
      { label:"In progress", id: "in-progress" },
      { label:"Not started", id: "not_started" },
      { label:"Published", id: "published" },
      { label:"Submitted", id: "submitted" },
      { label:"Uncertified", id: "uncertified" }
  ]
  
    let selectedStates = []
    let selectedYears = []
    let selectedStatuses = []
  useEffect(() => {
    let yearArray = []  
    for (let x = 2020; x <= currentYear; x++)// 2020 is the first year the new CARTS was used so there won't be an < 2020 forms
    {
      yearArray.push({ label: x.toString(), id: x.toString() })
    }
    setYearList(yearArray)
    getStatuses();
  }, []);

  

  const onSelectState = (element) => {
    selectedStates = element.map((state) => {return state.id})
    console.log("state array",selectedStates)
}
  const onSelectYear = (element) => {
    selectedYears = element
    console.log("year array",selectedYears)
}

const onSelectStatus = (element) => {
  selectedStatuses = element
  console.log("status array",selectedStatuses)
}
  const FilterReports = () => {
    
    getStatuses(selectedYears,selectedStates, selectedStatuses)
  }

  return (
    <div className="homepage ds-l-col--12">
      <div className="ds-l-container">
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
              <div className="ds-l-row ">
                <div className="">   
                  Search and Filter results
                  <div className="">
                    <Multiselect
                    options={stateList}
                    onSelect={(element)=> onSelectState(element)}
                    onRemove={(element)=> onSelectState(element)}
                    displayValue="label" 
                    />
                  </div>
                  <div>
                  <Multiselect
                    options={yearList}
                    onSelect={(element)=> onSelectYear(element)} 
                    onRemove={(element)=> onSelectYear(element)} 
                    displayValue="label" 
                    />
                  </div>
                  <div>
                  <Multiselect
                    options={statusList}
                    onSelect={(element)=> onSelectStatus(element)} 
                    onRemove={(element)=> onSelectStatus(element)} 
                    displayValue="label" 
                    />
                  </div>
                  <div>
                    <Button 
                      type="button"
                      class="ds-c-button ds-c-button--primary"
                      onClick={() => FilterReports()}>Filter</Button>
                  </div>
                </div>
              </div>
              <div className="ds-l-row">
                <legend className="ds-u-padding--2 ds-h3">All Reports</legend>
              </div>
              <div className="report-header ds-l-row">
                <div className="name ds-l-col--3">Report</div>
                <div className="status ds-l-col--3">Status</div>
                <div className="actions ds-l-col--6">Actions</div>
              </div>
              {console.log("statuses",statuses)}
              {statuses
                .sort((a, b) => (a.state > b.state ? 1 : -1))
                .map(({ state, stateCode, status }) =>
                  // with statement below we don't get the three bogus records (username, status, and lastchanged)
                  stateCode.toString().length === 2 ? (
                    <ReportItem
                      key={stateCode}
                      link1URL={`/views/sections/${stateCode}/${currentYear}/00/a`}
                      name={`${state} ${currentYear}`}
                      statusText={status}
                      editor="x@y.z"
                      userRole={currentUserRole}
                    />
                  ) : null
                )}
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
};

const mapState = (state) => ({
  statuses: selectFormStatuses(state),
  currentYear: state.global.formYear,
<<<<<<< HEAD
  stateList: state.allStatesData.map((element) => {
    return { label: element.name, id: element.code };
  }),
  reportstate: state.reportStatus
=======
  currentUserRole: state.stateUser.currentUser.role,
>>>>>>> c61794d25ecfce2ea00df6a5596fba8869c9df32
});

const mapDispatch = {
  getStatuses: getAllStateStatuses ?? {},
};

export default connect(mapState, mapDispatch)(CMSHomepage);
