import React from "react";
import { MemoryRouter as MemoryRouterOriginal } from "react-router";

export const MemoryRouter = ({ children, ...props }) => (
  <MemoryRouterOriginal
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    {...props}
  >
    {children}
  </MemoryRouterOriginal>
);
