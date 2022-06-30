import { Alert } from "@cmsgov/design-system";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectHasError } from "../../store/save.selectors";

const SaveError = ({ saveError }) => {
  const [showSaveErrorAlert, setShowErrorAlert] = useState(saveError);

  useEffect(() => {
    setShowErrorAlert(saveError);
  }, [saveError]);

  return (
    <div
      aria-hidden={!showSaveErrorAlert}
      aria-live="polite"
      className={`alert--unexpected-error ${
        showSaveErrorAlert ? "alert--unexpected-error__active" : ""
      }`}
    >
      <Alert
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
          <button
            aria-label="Close alert"
            className="hide-alert-button"
            onClick={() => setShowErrorAlert(false)}
          >
            X
          </button>
        </div>
      </Alert>
    </div>
  );
};

SaveError.propTypes = {
  hasError: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  saveError: selectHasError(state),
});

export default connect(mapStateToProps)(SaveError);
