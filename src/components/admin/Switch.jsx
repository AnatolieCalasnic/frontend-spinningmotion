import React from 'react';

const Switch = ({ checked, onCheckedChange, className = '' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        ${checked ? 'bg-black' : 'bg-gray-200'}
        transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        ${className}
      `}
    >
      <span
        className={`
          ${checked ? 'translate-x-6' : 'translate-x-1'}
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        `}
      />
    </button>
  );
};

export default Switch;