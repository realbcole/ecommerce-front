import React from 'react';

// Account input component
// Used on account page and cart page
const AccountInput = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-2 mb-2 bg-secondaryBg text-primaryDark/75 rounded-md ${className}`}
      {...props}
    ></input>
  );
};

export default AccountInput;
