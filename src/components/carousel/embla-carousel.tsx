import React from 'react';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import './embla-carousel.css';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from '@/components/carousel/embla-carousel-arrow-buttons';
import { DotButton, useDotButton } from '@/components/carousel/embla-carousel-dot-button';

// Update the type to reflect that slides can contain JSX elements
type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  return (
    <section className="mx-auto max-w-[48rem]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div className="min-w-0 flex-none basis-[75%]" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-[1.8rem] grid grid-cols-[auto_1fr] justify-between gap-10">
        <div className="flex items-center gap-2">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="-mr-1.5 flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index === selectedIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
