import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import the provided colorful real-world logos
import trustpilotLogo from '../../imports/trustpilot-1.png';
import tripadvisorLogo from '../../imports/tripadvisor-1.png';
import pataLogo from '../../imports/pata-finland-chapter.jpg';

// We'll alternate the logos to create a continuous, full marquee
const logos = [
  { src: trustpilotLogo, alt: "Trustpilot" },
  { src: tripadvisorLogo, alt: "Tripadvisor" },
  { src: pataLogo, alt: "PATA Finland Chapter" },
  { src: trustpilotLogo, alt: "Trustpilot" },
  { src: tripadvisorLogo, alt: "Tripadvisor" },
  { src: pataLogo, alt: "PATA Finland Chapter" },
];

export function BrandLogos() {
  return (
    <section className="bg-transparent py-[60px] w-full overflow-hidden">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 flex flex-col items-center">
        
        <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-10 text-center">
          Our Trusted Partners & Reviews
        </p>

        {/* Marquee Container */}
        <div className="relative w-full max-w-[1200px] overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          
          <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
            {/* First Set */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-1-${index}`} 
                className="flex items-center justify-center mx-12 shrink-0"
              >
                <ImageWithFallback 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-[40px] md:h-[48px] w-auto object-contain mix-blend-multiply" 
                />
              </div>
            ))}
            
            {/* Second Set (Duplicate for seamless loop) */}
            {logos.map((logo, index) => (
              <div 
                key={`logo-2-${index}`} 
                className="flex items-center justify-center mx-12 shrink-0"
              >
                <ImageWithFallback 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-[40px] md:h-[48px] w-auto object-contain mix-blend-multiply" 
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Internal Style for Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}} />
    </section>
  );
}