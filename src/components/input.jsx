// H:/LibrarySystem/src/components/input.jsx
import React from "react";

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={`px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full text-sm ${className}`}
      {...props}
    />
  );
};
