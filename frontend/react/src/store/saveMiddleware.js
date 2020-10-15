import axios from "../authenticatedAxios";

import { QUESTION_ANSWERED } from "../actions/initial";
import { SET_FRAGMENT } from "../actions/repeatables";

export const SAVE_STARTED = "automatic save has started";
export const SAVE_FINISHED = "automated save has finished";

const saveMiddleware = (store) => {
  let isSaving = false;
  const pending = [];
  const queued = [];
  let timer = null;

  const doSave = ({ data, fragmentId = false } = {}) => {
    // If there is a save in progress already, don't start another one because
    // we could end up sending duplicate changes and we don't know how that
    // would pan out, and also because we can't be sure what order the saves
    // will be processed on the server. So... just send one. But queue up
    // another save when this one is finished, so we don't lose track of the
    // intention here.
    if (isSaving) {
      queued.push({ data, fragmentId });
      return;
    }

    if (fragmentId !== false) {
      pending.push({ data, fragmentId });
    }

    // If we are not already saving, clear the save timer, if there is one.
    // This is how we debounce the save so that it only runs after some
    // period of user inactivity.
    clearTimeout(timer);

    // Now set the timer for actually doing the save. It'll run 300 ms after
    // the most recent call to save.
    timer = setTimeout(async () => {
      // We're saving now. Don't allow any more saves to start.
      isSaving = true;

      try {
        store.dispatch({ type: SAVE_STARTED });
        await axios.put(
          "/api/v1/sections",
          // In a future world, we might save only the pending changes, but for
          // now, we save by posting the whole document in its current state.
          store.getState().formData
        );

        // If the save is successful, we can clear out the list of pending
        // saves, because they have been persisted on the server.
        pending.length = 0;

        store.dispatch({ type: SAVE_FINISHED, error: false });
      } catch (error) {
        // In the event of an error, we might dispatch some other action here
        // to set a global error state and update the autosave header. TBD.

        let errorMessage = "An unknown error occurred";

        if (error.response && error.response.status === 401) {
          errorMessage = "You are not currently logged in";
          // User is not logged in.
        } else if (error.response && error.response.status === 403) {
          // User does not have permission.
          errorMessage = "You do not have permission to save";
        } else {
          // Some other server-side error.
        }

        store.dispatch({ type: SAVE_FINISHED, error: true, errorMessage });
      }

      // When the save is finished, we can clear that flag.
      isSaving = false;

      // If any new saves came in while we were saving, moves those from the
      // queue into the pending list and fire up another save.
      if (queued.length) {
        pending.push(...queued);
        queued.length = 0;
        doSave();
      }
    }, 300);
  };

  return (next, { runSave = doSave } = {}) => (action) => {
    const result = next(action);
    switch (action.type) {
      case QUESTION_ANSWERED:
      case SET_FRAGMENT:
        runSave(action);
        break;
      default:
        break;
    }
    return result;
  };
};

export default saveMiddleware;
