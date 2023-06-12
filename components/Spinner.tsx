import { RevealWrapper } from 'next-reveal';
import React from 'react';
import { MoonLoader } from 'react-spinners';
import { SpinnerProps } from '../types';

// Spinner component
// Used to display loading spinner
const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <RevealWrapper className="flex justify-center items-center">
      <MoonLoader className={className} />
    </RevealWrapper>
  );
};

export default Spinner;
