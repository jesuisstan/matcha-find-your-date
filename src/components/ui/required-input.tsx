import * as React from 'react';

import { cn } from '@/utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  value?: string | number; // Add value prop here for pre-typed value
}

const RequiredInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', errorMessage, value = '', onBlur, onInput, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value); // Initialize state with passed value
    const [showError, setShowError] = React.useState(false);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(event);
      if (errorMessage) setShowError(!event.target.validity.valid);
    };

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
      if (onInput) onInput(event);
      setInputValue(event.currentTarget.value); // Update state with the new value
      setShowError(false); // Hide error message when user starts typing
    };

    return (
      <div className={className}>
        <input
          type={type}
          value={inputValue} // Bind input value to state
          required
          aria-invalid={showError ? 'true' : 'false'}
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
            showError ? 'border-negative' : 'border-muted'
          )}
          ref={ref}
          onBlur={handleBlur}
          onInput={handleInput}
          {...props}
        />

        <span className={cn('text-xs text-negative', showError ? 'opacity-100' : 'opacity-0')}>
          {errorMessage || '\u00A0'}
        </span>
      </div>
    );
  }
);

RequiredInput.displayName = 'Input';

export { RequiredInput };
