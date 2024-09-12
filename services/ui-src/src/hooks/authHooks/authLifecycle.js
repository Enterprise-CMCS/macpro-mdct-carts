import { Auth, Hub } from "aws-amplify";
import { add } from "date-fns";

/*
 * After the token expires, refresh tokens will be used in the allotted idle window.
 * If not retrieved, they will be prompted at the specified time to refresh or logout.
 */
export const IDLE_WINDOW = 1 * 60 * 1000; // ms
export const PROMPT_AT = 0.5 * 60 * 1000; //ms

let authManager;

/**
 * Singleton service for tracking auth events and emitting any relevant actions to store
 * Tracks login/timeouts
 */
class AuthManager {
  updateTimeout = debounce(() => this.setTimer());

  constructor() {
    // Force users with stale tokens greater than the timeout to log in for a fresh session
    const expiration = localStorage.getItem("mdctcarts_session_exp");
    const isExpired =
      expiration && new Date(expiration).valueOf() < Date.now().valueOf();
    if (isExpired) {
      localStorage.removeItem("mdctcarts_session_exp");
      Auth.signOut().then(() => {
        window.location.href = "/";
      });
    }

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
  refreshCredentials = async () => {
    await Auth.currentAuthenticatedUser({ bypassCache: true }); // Force a token refresh
    this.setTimer();
  };

  /**
   * Timer function for idle timeout, keeps track of an idle timer that triggers a forced logout timer if not reset.
   */
  setTimer = () => {
    const expiration = add(Date.now(), {
      seconds: IDLE_WINDOW / 1000,
    }).toString();
    localStorage.setItem("mdctcarts_session_exp", expiration);
  };
}

// We're using a debounce because this can fire a lot...
const debounce = (func, timeout = 2000) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const initAuthManager = () => {
  authManager = new AuthManager();
};

export const refreshCredentials = async () => {
  await authManager.refreshCredentials();
  return localStorage.getItem("mdctmcr_session_exp");
};

export const updateTimeout = async () => {
  await authManager.updateTimeout();
};

export const getExpiration = () => {
  return localStorage.getItem("mdctmcr_session_exp") || "";
};
