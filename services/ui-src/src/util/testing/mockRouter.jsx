import React from "react";
import { MemoryRouter as MemoryRouterOriginal } from "react-router";

export const MemoryRouter = ({ children, ...props }) => (
  <MemoryRouterOriginal {...props}>{children}</MemoryRouterOriginal>
);
