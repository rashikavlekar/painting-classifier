import React from 'react';

const ActionButton = ({ onClick, icon, text, primary = false, small = false }) => {
  const base = "flex items-center justify-center gap-2 font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const size = small ? "px-4 py-2 text-sm" : "px-6 py-3";
  const primaryClasses = "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500";
  const secondaryClasses = "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:ring-gray-500";

  return (
    <button onClick={onClick} className={`${base} ${size} ${primary ? primaryClasses : secondaryClasses}`}>
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default ActionButton;
