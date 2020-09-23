import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { secureLoadUserThenSections } from "../../actions/initial";
import { useOktaAuth } from '@okta/okta-react';

const SecureInitialDataLoad = () => {
  const { authState, authService } = useOktaAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // show logged-out page here?
    } else {
      authService.getUser().then((info) => {
        dispatch(secureLoadUserThenSections({userData: info, authState: authState}))
      })
    }



  }, [authState, authService]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default SecureInitialDataLoad;

