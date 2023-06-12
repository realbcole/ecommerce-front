import React from 'react';
import { CenterProps } from '../types';

// Center component
// Used to center content on every page
const Center: React.FC<CenterProps> = ({ children, className }) => {
  return (
    <div
      className={`${className} max-w-[90%] mx-auto px-[20px] py-[30px] z-10`}
    >
      {children}
    </div>
  );
};

export default Center;
