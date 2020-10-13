import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";
import {
  loadUserThenSections,
  secureLoadUserThenSections,
} from "../../actions/initial";
import { setToken } from "../../axios";

const SecureInitialDataLoad = ({ stateCode, userData }) => {
  const { authState, authService } = useOktaAuth() ?? {};
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData !== false) {
      setToken();
      dispatch(loadUserThenSections({ stateCode, userData }));
    }
  }, []);

  useEffect(() => {
    if (authState && authService) {
      if (!authState.isAuthenticated) {
        // show logged-out page here?
      } else {
        authService.getUser().then((info) => {
          setToken(authState.accessToken);
          dispatch(
            secureLoadUserThenSections({
              userData: info,
              authState,
              authService,
              stateCode,
            })
          );
        });
      }
    }
  }, [authState, authService]);

  return null;
};

export default SecureInitialDataLoad;
