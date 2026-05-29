import { Quote } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BrandLogos } from '../components/BrandLogos';

import heroImg from '../../imports/image.png';
import ceoImg from '../../imports/CEO.png';
import buddhikaImg from '../../imports/Buddika_Gamage.png';
import primalImg from '../../imports/Primal_Gamage.png';

export function WhoWeAre() {
  const teamLeaders = [
    {
      name: "Buddhika Gamage",
      role: "Chief Executive Officer",
      image: buddhikaImg
    },
    {
      name: "Primal Gamage",
      role: "Operations Manager",
      image: primalImg
    }
  ];

  return (
    <div className="w-full bg-[#f8fbff] flex flex-col font-poppins min-h-screen pb-24">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#041d3c]/50 z-10 mix-blend-multiply" />
        <ImageWithFallback 
          src={heroImg} 
          alt="Who We Are - Simplifly Finland Oy" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 text-center px-6">
          <p className="text-white/90 font-medium text-[14px] uppercase tracking-[0.3em] mb-4 drop-shadow-md">
            Discover Our Story
          </p>
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Who We Are
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
            Elevating tropical travel through unparalleled luxury, deep local expertise, and seamless personalization.
          </p>
        </div>
      </section>

      {/* About Simplifly Finland Oy Section */}
      <section className="w-full max-w-screen-xl mx-auto px-12 lg:px-24 pt-24 pb-8 text-center">
        <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] mb-6">About Simplifly Finland Oy</h2>
        <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.8] font-medium max-w-4xl mx-auto">
          Established to strengthen collaborations with Finnish and Nordic tour operators, Simplifly Finland Oy provides reliable local support, profound destination expertise, and innovative luxury travel solutions. We are dedicated to creating meaningful, long-lasting partnerships and curating deeply authentic experiences tailored to the high expectations of Nordic travelers seeking the true essence of Sri Lanka and the Maldives.
        </p>
      </section>

      {/* CEO's Thought Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: CEO Image */}
          <div className="relative rounded-[16px] overflow-hidden shadow-[0_20px_60px_rgba(4,29,60,0.15)] aspect-[4/5] lg:aspect-square group">
            <ImageWithFallback 
              src={ceoImg} 
              alt="Buddhika Gamage - CEO" 
              className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Subtle overlay for luxury feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Right Side: CEO Thought */}
          <div className="relative flex flex-col justify-center bg-white p-10 lg:p-14 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.05)] border border-[#f4f7fb]">
            <Quote className="text-[#f4f7fb] w-24 h-24 absolute top-6 right-6 lg:top-10 lg:right-10 rotate-180 -z-0" />
            <div className="relative z-10">
              <h2 className="text-[#041d3c] font-bold text-3xl lg:text-[38px] mb-8">A Vision for Luxury</h2>
              <p className="text-[#041d3c]/80 text-[16px] lg:text-[18px] leading-[1.9] font-medium italic mb-10">
                "With over 16 years of experience, we don’t just book vacations—we architect lifelong memories. We've built a strong reputation in promoting the Maldives and Sri Lanka, curating seamless, luxurious journeys perfectly tailored to the high expectations of Nordic travelers and beyond. Flawless execution is the hallmark of true luxury, and we ensure that every logistical detail is invisible to our guests."
              </p>
              <div className="pt-6 border-t border-[#f4f7fb]">
                <h3 className="text-[#041d3c] text-[20px] font-bold">Buddhika Gamage</h3>
                <p className="text-[#041d3c]/60 text-[14px] font-bold tracking-[0.15em] uppercase mt-1">Chief Executive Officer</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 py-16">
        <div className="text-center mb-16">
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">Discover Simplifly</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] leading-tight">Experience Our World</h2>
        </div>
        <div className="relative w-full rounded-[16px] overflow-hidden shadow-[0_20px_60px_rgba(4,29,60,0.15)] aspect-video bg-[#041d3c] max-w-5xl mx-auto">
          <iframe 
            src="https://www.youtube.com/embed/w9tzrtut3Wc?autoplay=0&rel=0&showinfo=0" 
            title="Simplifly Finland Oy"
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* Trusted Partners */}
      <div className="py-12">
        <BrandLogos />
      </div>

      {/* Meet Our Team Leaders Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24 mb-24 pt-16">
        <div className="text-center mb-16">
          <p className="text-gray-500 font-medium text-[14px] uppercase tracking-[0.2em] mb-4">The People Behind the Magic</p>
          <h2 className="text-[#041d3c] font-bold text-4xl lg:text-[42px] leading-tight">Meet Our Team Leaders</h2>
          <div className="w-24 h-1 bg-[#041d3c]/10 mx-auto rounded-full mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 max-w-4xl mx-auto">
          {teamLeaders.map((leader, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="w-full rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(4,29,60,0.05)] group-hover:shadow-[0_20px_60px_rgba(4,29,60,0.15)] transition-all duration-500 aspect-square md:aspect-[4/5] mb-8 relative">
                <ImageWithFallback 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-[#041d3c]/0 group-hover:bg-[#041d3c]/10 transition-colors duration-500"></div>
              </div>
              <div className="text-center w-full bg-white py-6 px-4 rounded-[16px] shadow-[0_10px_30px_rgba(4,29,60,0.02)] group-hover:shadow-[0_15px_40px_rgba(4,29,60,0.08)] transition-all duration-500 border border-transparent group-hover:border-[#f4f7fb] -mt-16 relative z-10 mx-6 w-[calc(100%-3rem)]">
                <h3 className="text-[#041d3c] font-bold text-[24px] lg:text-[28px] mb-2">{leader.name}</h3>
                <p className="text-[#041d3c]/60 font-bold text-[13px] lg:text-[15px] tracking-[0.15em] uppercase">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
