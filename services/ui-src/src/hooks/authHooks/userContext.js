import { createContext } from "react";

export const UserContext = createContext({
  logout: async () => {
    console.log("User Context failed to initialize logout functionality");
  },
  loginWithIDM: () => {
    console.log("User Context failed to initialize IDM login functionality.");
  },
});
