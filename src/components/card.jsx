// H:/LibrarySystem/src/components/card.jsx
import React from "react";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={`p-4 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h2
      className={`text-xl font-semibold text-gray-800 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div
      className={`p-4 text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
