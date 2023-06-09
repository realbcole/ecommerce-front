import React from 'react';

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

const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="flex gap-4">
      {tabs.map((tabName) => (
        <Tab
          active={tabName === active}
          onClick={() => onChange(tabName)}
          key={tabName}
        >
          <h2 className="text-3xl font-semibold">{tabName}</h2>
        </Tab>
      ))}
    </div>
  );
};

export default Tabs;
