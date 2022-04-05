import { createContext } from "react";
// import { CognitoUser } from "@aws-amplify/auth";

/*
 * export interface CustomCognitoUser extends CognitoUser {
 *   role: string;
 * }
 */

/*
 * export interface UserContextInterface {
 *   user?: CustomCognitoUser;
 *   showLocalLogins?: boolean;
 *   logout: () => Promise<void>;
 *   loginWithIDM: () => void;
 *   isStateUser: boolean;
 *   userState?: string;
 *   userRole?: string;
 * }
 */

export const UserContext = createContext({
  logout: async () => {
    console.log("User Context failed to initialize logout functionality"); // eslint-disable-line no-console
  },
  loginWithIDM: () => {
    console.log("User Context failed to initialize IDM login functionality."); // eslint-disable-line no-console
  },
  isStateUser: false,
});
