// H:/LibrarySystem/src/components/button.jsx
import React from "react";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
