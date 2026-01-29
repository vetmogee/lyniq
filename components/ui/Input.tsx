'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`
            w-full px-4 py-3
            border-2 border-gray-900
            bg-black text-white
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900
            transition-all duration-200
            ${error ? 'border-red-600 focus:ring-red-600' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
