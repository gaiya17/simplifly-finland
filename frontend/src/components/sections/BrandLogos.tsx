"use client";
import React from 'react';
import { ImageWithFallback } from '../shared/ImageWithFallback';

// Import the provided colorful real-world logos
const trustpilotLogo = '/images/trustpilot-1.png';
const tripadvisorLogo = '/images/tripadvisor-1.png';
const pataLogo = '/images/pata-finland-chapter.jpg';

const BookingMarqueeLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-[30px] md:h-[36px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
    viewBox="0 0 5.693 2.848"
  >
    <defs>
      <clipPath id="marquee-A"><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id="marquee-B"><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
      <clipPath id="marquee-C"><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id="marquee-D"><path d="M589.5 28.656h94.48V12.958H589.5z"/></clipPath>
      <clipPath id="marquee-E"><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
      <clipPath id="marquee-F"><path d="M589.5 28.972H684V12.937h-94.5z"/></clipPath>
      <clipPath id="marquee-G"><path d="M589.5 12.937H684v16.035h-94.5z"/></clipPath>
    </defs>
    <g transform="matrix(.05809 0 0 -.05809 -34.141832 2.632382)">
      <g clipPath="url(#marquee-F)">
        <g clipPath="url(#marquee-G)">
          <path d="M626.558 27.217a1.436 1.436 0 1 0 2.872 0 1.437 1.437 0 0 0-2.872 0" fill="#003580"/>
          <path d="M649.215 17.64c0 .797.642 1.44 1.433 1.44a1.44 1.44 0 1 0-1.433-1.44" fill="#00b4f1"/>
          <path d="M603 18.263c-1.236 0-2.096.982-2.096 2.386s.86 2.384 2.097 2.384c1.243 0 2.112-.98 2.112-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.616 0-4.515-1.885-4.515-4.48s1.9-4.48 4.515-4.48c2.627 0 4.533 1.884 4.533 4.48s-1.906 4.482-4.532 4.482" fill="#003580"/>
          <path d="M623.785 20.294a2.136 2.136 0 0 1-.342.483l-.08.083.084.08a3.56 3.56 0 0 1 .36.45l2.3 3.432h-2.804l-1.735-2.685c-.098-.144-.296-.216-.593-.216h-.395v5.076c0 1.015-.633 1.153-1.316 1.153h-1.17l.003-11.98h2.484v3.594h.233c.283 0 .475-.033.564-.187l1.37-2.586c.383-.702.764-.82 1.482-.82h1.903l-1.418 2.344-.94 1.78" fill="#003580"/>
          <path d="M635.842 25.02c-1.264 0-2.07-.562-2.522-1.037l-.15-.152-.054.207c-.132.51-.58.788-1.253.788h-1.113l.007-8.653h2.467v3.988c0 .39.05.728.154 1.037.274.935 1.04 1.516 1.997 1.516.77 0 1.07-.407 1.07-1.457v-3.77c0-.896.415-1.315 1.312-1.315h1.174l-.004 5.504c0 2.186-1.067 3.342-3.086 3.342" fill="#003580"/>
          <path d="M628.042 24.824h-1.17l.008-8.653h1.247l.044-.002.582.002h.578v.003h.004l.005 7.335c0 .885-.423 1.314-1.298 1.314" fill="#003580"/>
          <path d="M612.747 18.134c-1.236 0-2.097.982-2.097 2.386s.86 2.384 2.098 2.384 2.112-.98 2.112-2.384c0-1.426-.85-2.386-2.112-2.386zm0 6.867c-2.618 0-4.518-1.885-4.518-4.48s1.9-4.48 4.52-4.48 4.533 1.884 4.533 4.48-1.9 4.482-4.533 4.482" fill="#003580"/>
        </g>
      </g>
      <g clipPath="url(#marquee-C)">
        <g clipPath="url(#marquee-D)">
          <g clipPath="url(#marquee-E)">
            <path d="M665.555 18.263c-1.236 0-2.098.982-2.098 2.386s.862 2.384 2.098 2.384c1.242 0 2.113-.98 2.113-2.384 0-1.426-.85-2.386-2.113-2.386zm0 6.867c-2.618 0-4.517-1.885-4.517-4.48s1.9-4.48 4.517-4.48c2.624 0 4.533 1.884 4.533 4.48s-1.9 4.482-4.533 4.482" fill="#00b4f1"/>
            <path d="M644.122 18.644c-1.35 0-1.83 1.176-1.83 2.28 0 .486.123 2.07 1.7 2.07.783 0 1.826-.224 1.826-2.15 0-1.817-.923-2.198-1.697-2.198zm2.978 6.332c-.468 0-.828-.187-1-.528l-.068-.132-.114.1c-.398.344-1.112.753-2.27.753-2.307 0-3.86-1.733-3.86-4.31s1.607-4.376 3.906-4.376c.785 0 1.406.184 1.898.556l.2.143v-.24c0-1.156-.747-1.794-2.102-1.794a4.98 4.98 0 0 0-1.66.306c-.522.158-.83.027-1.04-.498l-.196-.484-.277-.708.17-.09c.868-.46 1.997-.735 3.017-.735 2.1 0 4.554 1.075 4.554 4.1l.01 7.937H647.1" fill="#003580"/>
          </g>
        </g>
      </g>
      <g clipPath="url(#marquee-A)">
        <g clipPath="url(#marquee-B)">
          <path d="M593.805 18.362l-2.008.002v2.4c0 .514.2.78.638.842h1.37c.977 0 1.6-.616 1.6-1.613-.001-1.024-.617-1.63-1.6-1.63zm-2.008 6.476v.632c0 .553.234.816.747.85h1.028c.88 0 1.4-.527 1.4-1.41 0-.672-.362-1.457-1.377-1.457h-1.807zm4.572-2.396l-.363.204.317.27c.37.317.986 1.03.986 2.26 0 1.884-1.46 3.1-3.72 3.1h-2.874a1.26 1.26 0 0 1-1.214-1.244v-10.69h4.14c2.513 0 4.135 1.368 4.135 3.487 0 1.14-.524 2.116-1.405 2.612" fill="#003580"/>
          <path d="M681.107 25.12a3.4 3.4 0 0 1-2.648-1.283l-.178-.226-.14.253c-.458.833-1.244 1.256-2.337 1.256-1.147 0-1.916-.64-2.273-1.02l-.234-.253-.1.333c-.13.48-.557.743-1.203.743h-1.037l-.01-8.62h2.355v3.805a4.26 4.26 0 0 0 .125 1.008c.225.92.843 1.91 1.882 1.81.64-.062.954-.557.954-1.513v-5.11h2.372v3.805a3.45 3.45 0 0 0 .133 1.041c.2.878.836 1.778 1.838 1.778.726 0 .994-.41.994-1.514v-3.85c0-.87.388-1.26 1.26-1.26h1.108l.002 5.503c0 2.2-.968 3.314-2.872 3.314m-21.434-5.824c-.007-.01-1.02-1.077-2.355-1.077-1.216 0-2.444.746-2.444 2.41 0 1.438.952 2.443 2.316 2.443.442 0 .946-.158 1.025-.425l.01-.045a.866.866 0 0 1 .84-.637l1.3-.002v1.128c0 1.488-1.893 2.028-3.166 2.028-2.724 0-4.7-1.896-4.7-4.508s1.954-4.504 4.65-4.504c2.338 0 3.6 1.537 3.622 1.552l.068.084-1.022 1.695-.135-.143" fill="#00b4f1"/>
        </g>
      </g>
    </g>
  </svg>
);

// Alternating logo set including Booking.com inline vector
const logos = [
  { type: "image", src: trustpilotLogo, alt: "Trustpilot" },
  { type: "image", src: tripadvisorLogo, alt: "Tripadvisor" },
  { type: "booking", alt: "Booking.com" },
  { type: "image", src: pataLogo, alt: "PATA Finland Chapter" },
];

export function BrandLogos() {
  return (
    <section className="bg-transparent py-[80px] lg:py-[100px] w-full overflow-hidden relative font-poppins">
      
      {/* Subtle Glowing Background Blur */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none z-0" />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-center relative z-10">
        
        {/* Advanced Centered Section Header Badge with Symmetrical Flow Lines */}
        <div className="flex items-center gap-5 mb-14 w-full max-w-4xl justify-center">
          <div className="h-[1px] bg-[#1a84ff]/15 flex-grow rounded-full hidden sm:block" />
          <span className="text-[#1a84ff] font-extrabold text-[11px] lg:text-[12px] uppercase tracking-[0.3em] whitespace-nowrap bg-[#1a84ff]/8 border border-[#1a84ff]/10 rounded-full px-6 py-2 shadow-sm">
            ✦ Our Trusted Partners & Reviews
          </span>
          <div className="h-[1px] bg-[#1a84ff]/15 flex-grow rounded-full hidden sm:block" />
        </div>

        {/* Marquee Infinite Smooth Scrolling Container (Completely Box-less!) */}
        <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          
          <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap items-center py-4">
            
            {/* Loop 1 */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-1-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-108 cursor-pointer group"
              >
                {logo.type === "booking" ? (
                  <BookingMarqueeLogo />
                ) : (
                  <ImageWithFallback 
                    src={(logo.src as any)?.src || (logo.src as any) || ''} 
                    alt={logo.alt} 
                    className="h-[35px] md:h-[42px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                  />
                )}
              </div>
            ))}
            
            {/* Loop 2 (Seamless clone) */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-2-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-108 cursor-pointer group"
              >
                {logo.type === "booking" ? (
                  <BookingMarqueeLogo />
                ) : (
                  <ImageWithFallback 
                    src={(logo.src as any)?.src || (logo.src as any) || ''} 
                    alt={logo.alt} 
                    className="h-[35px] md:h-[42px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                  />
                )}
              </div>
            ))}

            {/* Loop 3 (Extra buffer clone) */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-3-${index}`} 
                className="flex items-center justify-center mx-10 lg:mx-16 shrink-0 transition-all duration-500 hover:scale-108 cursor-pointer group"
              >
                {logo.type === "booking" ? (
                  <BookingMarqueeLogo />
                ) : (
                  <ImageWithFallback 
                    src={(logo.src as any)?.src || (logo.src as any) || ''} 
                    alt={logo.alt} 
                    className="h-[35px] md:h-[42px] w-auto object-contain transition-all duration-500 opacity-85 group-hover:opacity-100" 
                  />
                )}
              </div>
            ))}
            
          </div>
        </div>

      </div>

      {/* Internal Style for Continuous Smooth Scrolling Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}} />
    </section>
  );
}
