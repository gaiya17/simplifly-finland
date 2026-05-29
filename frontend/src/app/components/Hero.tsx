import { useState, useEffect, useRef } from 'react';
import imgSriLanka from '../../imports/5-1.png';
import imgMaldives from '../../imports/sl_2.png';

const HERO_IMAGES = [
  { src: imgSriLanka, title: 'Sri Lanka' },
  { src: imgMaldives, title: 'Maldives' }
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0); 
  const [targetIndex, setTargetIndex] = useState(0);
  const [displayText, setDisplayText] = useState(HERO_IMAGES[0].title);
  const [isTyping, setIsTyping] = useState(false);
  const textRef = useRef(HERO_IMAGES[0].title);

  // Synchronized Animation Sequence: Backspace -> Change Image -> Type
  useEffect(() => {
    let isCancelled = false;

    const transitionToTarget = async () => {
      const nextWord = HERO_IMAGES[targetIndex].title;
      
      // If we are already at the target word, just ensure image matches
      if (textRef.current === nextWord) {
         setActiveIndex(targetIndex);
         return;
      }

      setIsTyping(true);

      // 1. Backspace current word smoothly
      while (textRef.current.length > 0 && !isCancelled) {
        textRef.current = textRef.current.slice(0, -1);
        setDisplayText(textRef.current);
        await new Promise((r) => setTimeout(r, 45)); // Slightly faster erase
      }

      if (isCancelled) return;

      // 2. Change image exactly when text is fully cleared
      setActiveIndex(targetIndex);

      // Brief pause to feel the image transition before typing begins
      await new Promise((r) => setTimeout(r, 400));

      if (isCancelled) return;

      // 3. Type new word
      for (let i = 0; i < nextWord.length; i++) {
        if (isCancelled) break;
        textRef.current += nextWord[i];
        setDisplayText(textRef.current);
        await new Promise((r) => setTimeout(r, 90)); // Satisfying type speed
      }

      if (!isCancelled) {
        // Keep cursor blinking for a brief moment after finishing before hiding
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

  // Interval for changing slides
  useEffect(() => {
    // 5.5 seconds gives plenty of time to appreciate the image and completed text
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
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              index === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              src={item.src}
              alt={`Luxury travel destination ${item.title}`}
              className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-out ${
                index === activeIndex ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        ))}
        {/* Strict dark blue gradient overlay to ensure text contrast and luxury feel matching #041d3c */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#041d3c]/90 via-[#041d3c]/40 to-transparent pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full pt-20 px-12 lg:px-24 mx-auto flex items-center justify-start w-full max-w-screen-2xl">
        <div className="flex flex-col items-start text-left gap-6 max-w-4xl w-full">
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md tracking-tight whitespace-nowrap">
            Explore{' '}
            <span className="text-[#D4AF37] relative">
              {displayText}
              <span 
                className={`absolute left-full text-white font-light transition-opacity duration-300 ml-1 ${
                  isTyping ? 'opacity-80 animate-[pulse_1s_ease-in-out_infinite]' : 'opacity-0'
                }`}
              >
                |
              </span>
            </span>
            {' '}With Ease
          </h1>
          <p className="text-[#f4f7fb]/90 text-sm lg:text-base font-normal max-w-2xl leading-relaxed drop-shadow mb-4">
            Discover paradise with our curated luxury travel experiences. From pristine beaches to cultural treasures, we craft unforgettable journeys tailored to your dreams.
          </p>
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute z-20 bottom-24 lg:bottom-32 left-12 lg:left-24 flex gap-3">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setTargetIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                index === activeIndex
                  ? 'w-10 bg-[#D4AF37]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
