import { Auth, Hub } from "aws-amplify";
import moment from "moment";
import { setAuthTimeout } from "../../store/stateUser";

/*
 * After the token expires, refresh tokens will be used in the allotted idle window.
 * If not retireved, they will bre prompted at the specified time to refresh or logout.
 */
const AUTH_TOKEN_VALIDITY = 30 * 60 * 1000; // ms
const IDLE_WINDOW = 30 * 60 * 1000; // ms
const PROMPT_AT = 59 * 60 * 1000; //ms
const SESSION_DURATION = AUTH_TOKEN_VALIDITY + IDLE_WINDOW;

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  store = null;
  timeoutPromptId = null;
  timoutForceId = null;
  lockRefresh = false;

  constructor(store) {
    // Force users with stale tokens > then the timeout to log in for a fresh session
    const exp = localStorage.getItem("mdctcarts_session_exp");
    if (exp && moment(exp).isBefore()) {
      localStorage.removeItem("mdctcarts_session_exp");
      Auth.signOut().then(() => {
        window.location.href = "/";
      });
    }
    this.store = store;
    // Setup hub listeners
    Hub.listen("auth", (data) => {
      const { payload } = data;
      this.onHubEvent(payload);
    });
    this.updateTimeout();
  }

  onHubEvent(payload) {
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
    if (this.lockRefresh) return;
    const expiration = moment().add(SESSION_DURATION, "milliseconds");
    if (this.timeoutPromptId) {
      clearTimeout(this.timeoutPromptId);
      clearTimeout(this.timeoutForceId);
    }
    localStorage.setItem("mdctcarts_session_exp", expiration);
    this.timeoutPromptId = setTimeout(
      (exp) => {
        this.promptTimeout(exp);
      },
      PROMPT_AT,
      expiration
    );
    this.timeoutForceId = setTimeout(() => {
      localStorage.removeItem("mdctcarts_session_exp");
      this.lockRefresh = true;
      Auth.signOut();
      this.lockRefresh = false;
    }, SESSION_DURATION);

    this.store.dispatch(setAuthTimeout(false, expiration));
  }

  promptTimeout(expirationTime) {
    this.store.dispatch(setAuthTimeout(true, expirationTime));
  }
}

export const initAuthManager = (store) => {
  authManager = new AuthManager(store);
};

export const refreshCredentials = async () => {
  await authManager.refreshCredentials();
};
