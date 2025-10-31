import React from "react";

export const Main = ({ className, id = "main-content", children }) => (
  <main tabIndex={"-1"} className={className} id={id}>
    {children}
  </main>
);
