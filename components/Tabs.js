import React from 'react';

// Tab component
const Tab = ({ active, onClick, children }) => {
  return (
    <div
      className={`${
        active
          ? 'text-secondaryBg border-b border-secondaryBg'
          : 'text-secondaryBg/75'
      } cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Tabs component
// Used to display tabs on account page
const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="flex gap-4">
      {tabs.map((tabName) => (
        <Tab
          active={tabName === active}
          onClick={() => onChange(tabName)}
          key={tabName}
        >
          <h2 className="text-2xl md:text-4xl">{tabName}</h2>
        </Tab>
      ))}
    </div>
  );
};

export default Tabs;
