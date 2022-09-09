import { Hub } from "aws-amplify";
import { setTimeout } from "../../store/stateUser";

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
export class AuthManager {
  expiration = 0;
  refreshed = null;
  showTimeoutPanel = false;
  setShowTimeoutPanel = null;
  store = null;
  verboseLogging = true; // TODO: false

  constructor(store) {
    this.store = store;
    // Setup hub listeners
    Hub.listen("auth", (data) => {
      const { payload } = data;
      this.onAuthEvent(payload);
      if (this.verboseLogging) this.logEvent(payload);
    });
  }

  onAuthEvent(payload) {
    switch (payload.event) {
      case "signIn":
        this.expiration = 1000;
        this.refreshed = Date.now();
        this.store.dispatch(setTimeout(false, this.expiration));
        break;
      // TODO: Update with refresh action & time
      default:
        break;
    }
  }

  // Convenience function for local debugging
  logEvent(payload) {
    if (this.verboseLogging) {
      if (!payload.data) {
        // eslint-disable-next-line no-console
        console.log("auth payload: ", payload);
        return;
      }
      // eslint-disable-next-line no-console
      console.log(
        "Auth event - user:",
        payload.data.username + "- event: " + payload.event
      );
    }
  }
}
