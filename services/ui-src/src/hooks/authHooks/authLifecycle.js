import { Auth, Hub } from "aws-amplify";
import moment from "moment";
import { setTimeout } from "../../store/stateUser";

const REFRESH_VALIDITY = 6;
// const ID_VALIDITY = 3;

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
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
        this.refreshed = Date.now();
        this.store.dispatch(setTimeout(true, this.getNewExpiration()));
        break;
      // TODO: Update with refresh action & time
      default:
        break;
    }
  }

  refreshCredentials() {
    const newTime = this.getNewExpiration();
    this.store.dispatch(setTimeout(false, newTime));

    Auth.currentSession();
  }

  getNewExpiration() {
    return moment().add(REFRESH_VALIDITY).minutes();
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

export const initAuthManager = (store) => {
  authManager = new AuthManager(store);
};

export const refreshCredentials = () => {
  authManager.refreshCredentials();
};
