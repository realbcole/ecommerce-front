import React from 'react';
import { IconProps } from '../../types';

const MinusIcon: React.FC<IconProps> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default MinusIcon;
