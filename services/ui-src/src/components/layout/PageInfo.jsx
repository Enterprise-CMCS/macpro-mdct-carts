import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import Title from "./Title";

const PageInfo = () => {
  const [lastSaved, status] = useSelector(
    (state) => [state.save.lastSave, state.reportStatus.status],
    shallowEqual
  );
  return (
    <div className="page-info">
      <div className="edit-info no-print" data-testid="edit-info-display">
        {status ?? "draft"}
        {lastSaved && ` | Last Edit: ${lastSaved.toLocaleDateString()}`}
      </div>
      <Title />
    </div>
  );
};

export default PageInfo;
