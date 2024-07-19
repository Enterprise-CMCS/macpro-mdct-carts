import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import moment from "moment";
import Autosave from "../fields/Autosave";
import Title from "./Title";

const PageInfo = () => {
  const [lastSaved, status] = useSelector(
    (state) => [moment(state.save.lastSave), state.reportStatus.status],
    shallowEqual
  );
  return (
    <div className="page-info">
      <div className="edit-info no-print" data-testid="edit-info-display">
        {status ?? "draft"}
        {lastSaved.isValid() && ` | Last Edit: ${lastSaved.format("M/D/YYYY")}`}
      </div>
      <Title />
      <Autosave />
    </div>
  );
};

export default PageInfo;
