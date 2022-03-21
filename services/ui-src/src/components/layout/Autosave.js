import React, { useState } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";

import SaveMessage from "./SaveMessage";
import { selectLastSave, selectIsSaving } from "../../store/save.selectors";

const Check = () => <FontAwesomeIcon icon={faCheck} />;
const Spinner = () => <FontAwesomeIcon icon={faSpinner} spin />;

/**
 *
 * Autosave status message.
 * Should connect to store for latest status.
 * @returns styled autosave text or an empty column.
 * excluded - Array of pages to that do not show the Autosave message.
 */
const Autosave = ({ isSaving, lastSaved }) => {
  const [active, setActive] = useState(isSaving);
  const [delayTimer, setDelayTimer] = useState();

  const path = window.location.path;
  const excluded = ["/", "no-access"];

  if (excluded.indexOf(path) > -1) {
    return <div className="save-status ds-l-col--6 ds-u-border--0"></div>;
  }

  if (isSaving !== active) {
    if (isSaving) {
      // If we have switched from not saving to saving, make the UI change
      // immediately.
      setActive(true);

      // If there's already a save delay timer, clear it.
      clearTimeout(delayTimer);

      // Wait 750ms after the last save began before changing the UI back to
      // "saved" from the spinner.
      setDelayTimer(
        setTimeout(() => {
          // This prompts a re-render. If the isSaving prop is still true, then
          // the conditional at the start will pass, and we'll end up back in
          // the block that creates the delay timer. This ensures that we don't
          // switch to the "last saved" UI state if the saving action is not
          // yet completed.
          setActive(false);
        }, 750)
      );
    }
  }

  return (
    <div className="save-status ds-l-col--6">
      {active ? (
        <>
          <Spinner /> Saving...
        </>
      ) : (
        <>
          <Check /> <SaveMessage lastSaved={lastSaved} />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isSaving: selectIsSaving(state),
  lastSaved: selectLastSave(state),
});

export default connect(mapStateToProps)(Autosave);
