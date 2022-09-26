import { Auth, Hub } from "aws-amplify";
import moment from "moment";
import { setAuthTimeout } from "../../store/stateUser";

const REFRESH_TOKEN_VALIDITY = 60 * 60 * 1000; // ms
const PROMPT_AT = 59 * 60 * 1000; //ms

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  store = null;
  verboseLogging = true; // TODO: false
  timeoutId = null;

  constructor(store) {
    this.store = store;
    // Setup hub listeners
    Hub.listen("auth", (data) => {
      const { payload } = data;
      this.onAuthEvent(payload);
      if (this.verboseLogging) this.logEvent(payload);
    });
    this.updateTimeout();
  }

  onAuthEvent(payload) {
    // Track events that issue new tokens and keep our timers accurate
    switch (payload.event) {
      case "signIn":
      case "tokenRefresh":
        this.updateTimeout();
        break;
      default:
        break;
    }
  }

  async refreshCredentials() {
    await Auth.currentAuthenticatedUser({ bypassCache: true }); // Force a token refresh
  }

  updateTimeout() {
    const expiration = moment().add(REFRESH_TOKEN_VALIDITY, "milliseconds");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(
      (exp) => {
        this.promptTimeout(exp);
      },
      PROMPT_AT,
      expiration
    );

    this.store.dispatch(setAuthTimeout(false, expiration));
  }

  promptTimeout(expirationTime) {
    this.store.dispatch(setAuthTimeout(true, expirationTime));
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

export const refreshCredentials = async () => {
  await authManager.refreshCredentials();
};
