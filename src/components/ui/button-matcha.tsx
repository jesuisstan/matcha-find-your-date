import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import Spinner from '@/components/ui/spinner';
import { cn } from '@/utils/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center space-x-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 ease-in-out overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border bg-primary text-primary-foreground hover:bg-primary/80 smooth42transition',
        destructive: 'bg-negative text-foreground hover:bg-negative/80 smooth42transition',
        outline:
          'border border-secondary bg-background hover:bg-accent hover:text-accent-foreground hover:border-c42orange smooth42transition',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 smooth42transition',
        ghost: 'hover:bg-accent hover:text-accent-foreground smooth42transition',
        link: 'text-primary underline-offset-4 hover:underline italic smooth42transition',
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size={6} />
        ) : (
          <span className="line-clamp-2 text-center">{children}</span>
        )}
      </Comp>
    );
  }
);

ButtonMatcha.displayName = 'ButtonMatcha';

export { ButtonMatcha, buttonVariants };
