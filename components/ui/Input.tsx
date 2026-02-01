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
            border-2 border-[#636362]
            bg-[#141414] text-white
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#636362] focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#636362]
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
