"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg shadow-md focus:outline-none bg-gray-800/40 backdrop-blur-md ${
            error ? "border-red-500/50 text-red-300" : "border-gray-700/50 text-gray-200"
          } border focus:border-indigo-500/50 hover:border-gray-600/70 transition-all ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;