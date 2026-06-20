import React, { type InputHTMLAttributes } from 'react';
import './TextField.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, required, error, id, className, ...props }, ref) => {
    const inputId = id || `tf-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const inputCls = ['text-field__input', error && 'text-field__input--error']
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`text-field${className ? ` ${className}` : ''}`}>
        <label className="text-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="text-field__required"> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={inputCls}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className="text-field__error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
