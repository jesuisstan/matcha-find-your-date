import React, { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react';

import { EmblaCarouselType } from 'embla-carousel';
import { Circle, CircleDot } from 'lucide-react';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

type TDotButtonProps = ComponentPropsWithRef<'button'> & {
  selected: boolean;
};

export const DotButton: React.FC<TDotButtonProps> = ({ selected, ...restProps }) => {
  return (
    <button type="button" {...restProps}>
      {selected ? (
        <CircleDot size={18} className="text-foreground smooth42transition hover:text-c42orange" />
      ) : (
        <Circle size={16} className="text-secondary smooth42transition hover:text-c42orange" />
      )}
    </button>
  );
};
