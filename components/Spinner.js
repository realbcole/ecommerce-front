import React from 'react';
import { MoonLoader } from 'react-spinners';

// Spinner component
// Used to display loading spinner
const Spinner = ({ className }) => {
  return (
    <div className="flex justify-center items-center">
      <MoonLoader className={className} />
    </div>
  );
};

export default Spinner;
