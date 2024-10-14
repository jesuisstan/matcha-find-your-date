import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

import Spinner from '@/components/ui/spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 ease-in-out overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'group relative overflow-hidden border bg-primary text-primary-foreground smooth42transition',
        destructive:
          'group relative overflow-hidden bg-negative text-foreground smooth42transition',
        secondary:
          'group relative overflow-hidden bg-secondary text-secondary-foreground smooth42transition',
        outline:
          'group relative overflow-hidden border border-secondary bg-background hover:bg-accent hover:text-accent-foreground hover:border-c42orange smooth42transition',
        ghost:
          'group relative overflow-hidden hover:bg-accent hover:text-accent-foreground smooth42transition',
        link: 'group relative overflow-hidden text-primary underline-offset-4 hover:underline italic smooth42transition',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const ButtonMatcha = React.forwardRef<HTMLButtonElement, TButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {(variant === 'default' || variant === 'destructive' || variant === 'secondary') && (
          <span
            className={clsx(
              'absolute inset-0 h-full w-full transition-transform duration-500 ease-in-out',
              !disabled
                ? 'translate-x-[-100%] bg-background/30 group-hover:translate-x-0'
                : 'translate-x-0 bg-background/30' // Animation for disabled
            )}
          />
        )}
        {loading ? (
          <Spinner size={6} />
        ) : (
          <span className="relative z-10 line-clamp-2 text-center">{children}</span>
        )}
      </Comp>
    );
  }
);

ButtonMatcha.displayName = 'ButtonMatcha';

export { ButtonMatcha, buttonVariants };
