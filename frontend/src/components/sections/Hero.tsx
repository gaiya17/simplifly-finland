"use client";
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../lib/i18n/LanguageContext';
const imgSriLanka = '/images/heroSL.webp';
const imgMaldives = '/images/heroMALD.webp';

const HERO_IMAGES = [
  { src: typeof imgSriLanka === 'object' ? (imgSriLanka as any).src : imgSriLanka, title: 'Sri Lanka' },
  { src: typeof imgMaldives === 'object' ? (imgMaldives as any).src : imgMaldives, title: 'Maldives' },
];

export function Hero() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [displayText, setDisplayText] = useState(HERO_IMAGES[0].title);
  const [isTyping, setIsTyping] = useState(false);
  const textRef = useRef(HERO_IMAGES[0].title);

  // Synchronized Animation Sequence: Backspace → Change Image → Type
  useEffect(() => {
    let isCancelled = false;

    const transitionToTarget = async () => {
      const nextWord = HERO_IMAGES[targetIndex].title;

      if (textRef.current === nextWord) {
        setActiveIndex(targetIndex);
        return;
      }

      setIsTyping(true);

      // 1. Backspace current word smoothly
      while (textRef.current.length > 0 && !isCancelled) {
        textRef.current = textRef.current.slice(0, -1);
        setDisplayText(textRef.current);
        await new Promise((r) => setTimeout(r, 45));
      }

      if (isCancelled) return;

      // 2. Change image exactly when text is fully cleared
      setActiveIndex(targetIndex);

      // Brief pause before typing begins
      await new Promise((r) => setTimeout(r, 400));

      if (isCancelled) return;

      // 3. Type new word
      for (let i = 0; i < nextWord.length; i++) {
        if (isCancelled) break;
        textRef.current += nextWord[i];
        setDisplayText(textRef.current);
        await new Promise((r) => setTimeout(r, 90));
      }

      if (!isCancelled) {
        setTimeout(() => {
          if (!isCancelled) setIsTyping(false);
        }, 1000);
      }
    };

    transitionToTarget();

    return () => {
      isCancelled = true;
    };
  }, [targetIndex]);

  // Auto-advance interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#041d3c]">
      {/* Background Images with Ken Burns Effect */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((item, index) => (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
          >
            <img
              src={item.src}
              alt={`Luxury travel destination ${item.title}`}
              className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-out ${index === activeIndex ? 'scale-105' : 'scale-100'
                }`}
            />
          </div>
        ))}
        {/* Dark gradient overlay — left-to-right fade for text legibility */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/40 to-transparent pointer-events-none" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#041d3c]/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full pt-20 px-6 sm:px-12 lg:px-24 mx-auto flex items-center justify-start w-full max-w-screen-2xl">
        <div className="flex flex-col items-start text-left gap-5 max-w-2xl w-full">
          <h1 className="text-white font-bold text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight drop-shadow-md  whitespace-nowrap">
            {t.hero.title}{' '}
            <span className="text-[#D4AF37] relative">
              {displayText}
              <span
                className={`absolute left-full ml-1 text-white font-light transition-opacity duration-300 ${isTyping ? 'opacity-80 animate-[pulse_1s_ease-in-out_infinite]' : 'opacity-0'
                  }`}
              >
                |
              </span>
            </span>
            {' '}{t.hero.titleSuffix}
          </h1>
          <p className="text-white/80 text-[15px] lg:text-[16px] font-normal max-w-xl leading-relaxed drop-shadow">
            {t.hero.subtitle}
          </p>
        </div>
      </div>

      {/* Slide Navigation Dots — positioned above the SupportCTA card which pulls up via negative margin (mt-[-55px] md:mt-[-70px] lg:mt-[-85px]) */}
      <div className="absolute z-40 bottom-24 sm:bottom-28 lg:bottom-32 left-6 sm:left-12 lg:left-24 flex gap-3">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setTargetIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${index === activeIndex
              ? 'w-10 bg-[#D4AF37]'
              : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

