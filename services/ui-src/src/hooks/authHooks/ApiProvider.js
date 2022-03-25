import React, { ReactNode, useEffect, useMemo, createContext } from "react";
import { API } from "aws-amplify";
import config from "../../config";

export const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  useEffect(() => {
    API.configure({
      endpoints: [
        {
          name: "coreSet",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      ],
    });
  }, []);

  const values = useMemo(() => ({}), []);
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
