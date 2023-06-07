import React from 'react';

const AccountInput = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-2 mb-2 border border-primaryGray rounded-lg ${className}`}
      {...props}
    ></input>
  );
};

export default AccountInput;
