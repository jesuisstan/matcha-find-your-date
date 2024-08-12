import clsx from 'clsx';

import styles from '@/styles/radio-button.module.css';
import { radioOptionPropsSchema, TRadioOptionProps } from '@/types/radio-button';

const RadioOption = ({ value, isSelected, onSelect, children }: TRadioOptionProps) => {
  /* Verifying the passed Props of the component */
  const verif = radioOptionPropsSchema.safeParse({
    value,
    isSelected,
    onSelect,
    children,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return (
    <div
      className={`flex cursor-pointer items-center gap-2 text-sm font-normal`}
      onClick={() => onSelect(value)}
    >
      <input
        id={value}
        type="radio"
        value={value}
        checked={isSelected}
        className={clsx(
          styles.radio,
          {
            pulse: isSelected,
          },
          `dark:bg-foreground`
        )}
        onChange={() => onSelect(value)}
      />
      <label className={'cursor-pointer'} htmlFor={value}>
        {children}
      </label>
    </div>
  );
};

export default RadioOption;
