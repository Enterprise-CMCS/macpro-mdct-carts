import React from "react";

export const Main = ({ className, id, children }) => (
  <main tabIndex={"-1"} className={className} id={id}>
    {children}
  </main>
);
