import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { chipsOptionPropsSchema, TChipsOptionProps } from '@/types/chips';

const ChipsOption = ({ paramName, value, isSelected, onSelect, children }: TChipsOptionProps) => {
  /* Verifying the passed Props of the component */
  const verif = chipsOptionPropsSchema.safeParse({
    paramName,
    value,
    isSelected,
    onSelect,
    children,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  if (!value) {
    return;
  }

  function customCountryName(name: string) {
    if (name === 'CN.3.MHT' || name === 'CN.3.NOMHT') {
      return 'asia';
    } else if (name === 'WO') {
      return 'europe';
    } else {
      return name;
    }
  }

  // Utility function to get a string representation of children to show correct label on hover
  const getTitleFromChildren = (children: React.ReactNode): string => {
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children);
    } else if (Array.isArray(children)) {
      return children.map(getTitleFromChildren).join(' ');
    } else if (React.isValidElement(children)) {
      return children.props.children ? getTitleFromChildren(children.props.children) : '';
    } else {
      return '';
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-labelledby={value}
      title={getTitleFromChildren(children)}
      className={clsx(
        `flex h-5 min-w-[54px] cursor-pointer flex-row items-center justify-center gap-1 whitespace-nowrap break-words rounded-3xl border-[1px] border-secondary px-[9px] py-[2px] text-center text-xs font-normal normal-case leading-loose`,
        `hover:border-negative`,
        isSelected ? 'bg-foreground text-card dark:bg-foreground' : 'bg-card text-foreground'
      )}
      onClick={() => onSelect(value)}
    >
      {paramName.includes('countries') && (
        <div className="ml-[-7px] overflow-hidden rounded-full">
          <Image
            src={`/country-flags/${customCountryName(value.split('_')[0])?.toLowerCase()}.svg`}
            alt="national-flag"
            width={0}
            height={0}
            className="h-[14px] w-[14px] object-cover"
          />
        </div>
      )}
      <div
        className={clsx(
          `flex cursor-pointer overflow-hidden text-ellipsis`,
          isSelected ? 'selected' : ''
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ChipsOption;
