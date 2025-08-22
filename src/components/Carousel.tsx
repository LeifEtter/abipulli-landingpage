import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import { useEffect, useState } from "react";
import { PrevButton, NextButton, usePrevNextButtons } from "./CarouselButton";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: { id: number; content: string }[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: true });

  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide: { id: number; content: string }, idx: number) => {
            function getCircularOffset(
              idx: number,
              selectedIndex: number,
              slideCount: number
            ) {
              let offset = idx - selectedIndex;
              if (Math.abs(offset) > slideCount / 2) {
                offset -= Math.sign(offset) * slideCount;
              }
              return offset;
            }
            const offset = getCircularOffset(idx, selectedIndex, slides.length);
            // Only hide slides that are clones (offset > slideCount/2), but always animate visible slides
            // const hide = Math.abs(offset) > slides.length / 2;
            const hide = selectedIndex == slides.length - 1;
            const style = {
              transform: hide
                ? ``
                : `rotateY(${offset * 10}deg) translateY(${
                    -Math.abs(offset) * 50
                  }px)`,
              opacity: offset === 0 ? 1 : 0.6,
              zIndex: 10 - Math.abs(offset),
              transition: "transform 0.5s, opacity 0.5s",
              //   display: hide ? "none" : "block",
            };
            return (
              <div className="embla__slide" key={slide.id} style={style}>
                <div className="embla__slide__number">{slide.id}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        {/* <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default EmblaCarousel;
