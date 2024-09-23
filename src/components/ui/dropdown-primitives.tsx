'use client';

import * as React from 'react';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { CheckSquare2, ChevronDown, ChevronRight, Circle, Square } from 'lucide-react';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;

const DropdownMenuSelector = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    value: string;
    startIcon?: React.ReactNode;
  }
>(({ className, value, startIcon, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} {...props}>
    <div
      title={value || 'Select value'}
      className={clsx(
        `group flex h-10 min-w-36 max-w-[300px] cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-muted bg-transparent px-3 text-sm font-normal transition-all duration-300 ease-in-out`,
        `hover:border-c42orange`,
        value ? 'text-foreground' : 'text-secondary',
        className
      )}
    >
      {startIcon}
      <div className="truncate">{value || 'Select'}</div>
      <ChevronRight
        className="relative top-[1px] h-4 text-secondary smooth42transition group-data-[state=open]:-rotate-180"
        aria-hidden
      />
    </div>
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuSelector.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuMultipleSelector = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    value: string;
    startIcon?: React.ReactNode;
  }
>(({ className, value, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} {...props}>
    <div
      title={value || 'Select value'}
      className={clsx(
        `group flex h-10 min-w-36 max-w-[300px] cursor-pointer select-none items-center justify-between gap-2 rounded-md border border-muted bg-transparent px-3 text-sm font-normal transition-all duration-300 ease-in-out`,
        `hover:border-c42orange`,
        `xl: max-w-xl, lg: max-w-full`,
        value ? 'text-foreground' : 'text-secondary',
        className
      )}
    >
      <div className="flex-1 overflow-hidden truncate text-ellipsis whitespace-nowrap">
        {value || 'Select'}
      </div>
      <ChevronDown
        className="relative top-[1px] h-4 shrink-0 text-secondary transition-transform ease-in group-data-[state=open]:-rotate-180"
        aria-hidden
      />
    </div>
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuMultipleSelector.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={clsx(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent',
      'focus:text-c42orange',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={clsx(
      'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(
        'text-popover-foreground z-50 max-h-96 min-w-[10rem] max-w-[242px] overflow-y-auto rounded-md border border-muted bg-card p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        `dark:border-secondary`,
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={clsx(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:text-c42orange',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={clsx(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:text-c42orange',
      className
    )}
    checked={checked}
    {...props}
  >
    <div title={children?.toString()} className="flex max-w-[150px] items-center truncate">
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Square className="h-4 w-4" />
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckSquare2 className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </div>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={clsx(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-normal text-foreground outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus:text-c42orange',
      className
    )}
    {...props}
  >
    <div title={children?.toString()} className="flex items-center truncate">
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current text-foreground" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <div className="overflow-hidden text-ellipsis">{children}</div>
    </div>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={clsx('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={clsx('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={clsx('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSelector,
  DropdownMenuMultipleSelector,
};
