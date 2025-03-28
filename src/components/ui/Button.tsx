"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium focus:outline-none transition-all shadow-lg backdrop-blur-md";
  
  const variantStyles = {
    primary: "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/50 hover:text-indigo-200",
    secondary: "bg-gray-800/40 border border-gray-700/40 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600/50 hover:text-gray-200",
    outline: "border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-200",
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
}