import { Auth, Hub } from "aws-amplify";
import { add } from "date-fns";
import { setAuthTimeout } from "../../store/stateUser";

/*
 * After the token expires, refresh tokens will be used in the allotted idle window.
 * If not retrieved, they will be prompted at the specified time to refresh or logout.
 */
const IDLE_WINDOW = 1 * 60 * 1000; // ms
const PROMPT_AT = 0.5 * 60 * 1000; //ms

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  store = null;
  timeoutPromptId = null;
  timoutForceId = null;
  updateTimeout = debounce(() => this.setTimer());

  constructor(store) {
    // Force users with stale tokens greater than the timeout to log in for a fresh session
    const expiration = localStorage.getItem("mdctcarts_session_exp");
    const isExpired = expiration && new Date(expiration).valueOf() < Date.now();
    if (isExpired) {
      localStorage.removeItem("mdctcarts_session_exp");
      Auth.signOut().then(() => {
        window.location.href = "/";
      });
    }
    this.store = store;
    Hub.listen("auth", (data) => {
      const { payload } = data;
      this.onHubEvent(payload);
    });
    this.updateTimeout();
  }

  /**
   * Track sign in events for users that log out and back in
   */
  onHubEvent(payload) {
    switch (payload.event) {
      case "signIn":
        this.setTimer();
        break;
      default:
        break;
    }
  }

  /**
   * Manual refresh of credentials paired with an instant timer clear
   */
  async refreshCredentials() {
    await Auth.currentAuthenticatedUser({ bypassCache: true }); // Force a token refresh
    this.setTimer();
  }

  /**
   * Timer function for idle timeout, keeps track of an idle timer that triggers a forced logout timer if not reset.
   */
  setTimer() {
    const expiration = add(Date.now(), { seconds: IDLE_WINDOW / 1000 });
    if (this.timeoutPromptId) {
      clearTimeout(this.timeoutPromptId);
      clearTimeout(this.timeoutForceId);
    }
    localStorage.setItem("mdctcarts_session_exp", expiration);
    this.timeoutPromptId = setTimeout(
      (exp) => {
        this.promptTimeout(exp);
        this.timeoutForceId = setTimeout(() => {
          localStorage.removeItem("mdctcarts_session_exp");
          Auth.signOut();
        }, IDLE_WINDOW - PROMPT_AT);
      },
      PROMPT_AT,
      expiration
    );

    this.store.dispatch(setAuthTimeout(false, expiration));
  }

  promptTimeout(expirationTime) {
    this.store.dispatch(setAuthTimeout(true, expirationTime));
  }
}

// We're using a debounce because this can fire a lot...
function debounce(func, timeout = 2000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
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
