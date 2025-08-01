import React from "react";
import { Alert } from "@cmsgov/design-system";
import { useSelector } from "react-redux";
// utils
import { selectHasError } from "../../store/save.selectors";

const SaveError = () => {
  const saveError = useSelector((state) => selectHasError(state));

  return saveError ? (
    <div
      aria-live="polite"
      className={`alert--unexpected-error "alert--unexpected-error__active"`}
    >
      <Alert
        autoFocus
        heading="There's been an unexpected error."
        role="alertdialog"
        variation="warn"
        data-test="component-header"
      >
        <div className="flex">
          <div>
            We weren&lsquo;t able to save your latest changes. Try saving in a
            few minutes. If you continue to see this message, refresh your
            browser. Before this issue is resolved, new changes may be lost if
            you continue to make edits or if you refresh your browser.
          </div>
        </div>
      </Alert>
    </div>
  ) : (
    <></>
  );
};

export default SaveError;
