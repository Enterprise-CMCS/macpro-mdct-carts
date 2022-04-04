import React from 'react';
import StateHeader from './StateHeader';
import TableOfContents from './TableOfContents';

const Sidebar = () => (
  <div className="sidebar ds-l-col--3">
    <StateHeader />
    <TableOfContents />
  </div>
);

export default Sidebar;
