import { Auth } from "aws-amplify";
import moment from "moment";
import { setAuthTimeout } from "../../store/stateUser";

/*
 * After the token expires, refresh tokens will be used in the allotted idle window.
 * If not retireved, they will bre prompted at the specified time to refresh or logout.
 */
const IDLE_WINDOW = 30 * 60 * 1000; // ms
const PROMPT_AT = 29 * 60 * 1000; //ms

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  store = null;
  timeoutPromptId = null;
  timoutForceId = null;

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
    this.updateTimeout();
  }

  async refreshCredentials() {
    await Auth.currentAuthenticatedUser({ bypassCache: true }); // Force a token refresh
    updateTimeout();
  }

  updateTimeout() {
    const expiration = moment().add(IDLE_WINDOW, "milliseconds");
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
      Auth.signOut();
    }, IDLE_WINDOW);

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

export const updateTimeout = async () => {
  await authManager.updateTimeout();
};
