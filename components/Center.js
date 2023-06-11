import React from 'react';

// Center component
// Used to center content on every page
const Center = ({ children, className }) => {
  return (
    <div
      className={`${className} max-w-[90%] mx-auto px-[20px] py-[30px] z-10`}
    >
      {children}
    </div>
  );
};

export default Center;
