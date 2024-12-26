import React from 'react';
import { useTranslations } from 'next-intl';

import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { CirclePlay, CircleStop } from 'lucide-react';

import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from '@/components/carousel/embla-carousel-arrow-buttons';
import { DotButton, useDotButton } from '@/components/carousel/embla-carousel-dot-button';
import { useAutoplay } from '@/components/carousel/embla-carousel-use-autoplay';
import { ButtonMatcha } from '@/components/ui/button-matcha';

type TPropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<TPropType> = (props) => {
    const t = useTranslations();
  
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 3000 }),
  ]);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaApi);

  return (
    <section className="mx-auto max-w-[48rem]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div key={index}>{slide}</div>
          ))}
        </div>
      </div>

      <div className="mt-[1.8rem] grid grid-cols-[auto_1fr] justify-between gap-10">
        <div className="ml-5 flex items-center gap-3">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="mr-5 flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              selected={index === selectedIndex}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center self-center">
        <ButtonMatcha onClick={toggleAutoplay} type="button" variant={'ghost'} size={'default'}>
          <div className="flex items-center justify-center gap-2">
            {autoplayIsPlaying ? <CircleStop size={30} /> : <CirclePlay size={30} />}
            <p className="text-sm">{t('slide-show')}</p>
          </div>
        </ButtonMatcha>
      </div>
    </section>
  );
};

export default EmblaCarousel;
