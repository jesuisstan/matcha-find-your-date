import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DescriptionWrapper = ({ smartdataDescription }: { smartdataDescription: string }) => {
  const { t } = useTranslation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animate = {
    transition: { duration: 0.5, ease: 'easeInOut', type: 'tween' },
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <motion.div
      layout
      title={
        isDescriptionExpanded
          ? 'Click to wrap the description'
          : 'Click to see the full description'
      }
      onClick={toggleDescription}
      className={clsx(
        'relative w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl bg-card p-4 pb-3 pt-2'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.p
        layout="position"
        className="text-base font-bold"
      >{t`common:documentation.description`}</motion.p>
      <motion.p
        layout="position"
        {...animate}
        className={clsx(
          'text-justify text-sm',
          isDescriptionExpanded ? 'h-auto' : 'text-ellipsis- line-clamp-3 h-[max-content]'
        )}
      >
        {smartdataDescription}
      </motion.p>
      <div
        className={clsx(
          'absolute bottom-0 left-[50%] m-auto w-min translate-x-[-50%]',
          isHovered
            ? 'duration-400 text-[#B42E2C] transition'
            : 'duration-400 text-slate-200 transition'
        )}
      >
        {isDescriptionExpanded ? (
          <ChevronUp
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        ) : (
          <ChevronDown
            size={18}
            className={clsx(
              isHovered
                ? 'opacity-100 transition duration-300'
                : 'opacity-0 transition duration-300'
            )}
          />
        )}
      </div>
    </motion.div>
  );
};

export default DescriptionWrapper;
