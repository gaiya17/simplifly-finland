import { Quote, Award, Globe, Users, Clock, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/shared/ImageWithFallback';
import { BrandLogos } from '../../components/sections/BrandLogos';

const ceoImg = '/images/CEO.webp';
const buddhikaImg = '/images/BuddikaGamage.webp';
const primalImg = '/images/PrimalGamage.webp';
const maldivesHero = '/images/whoWeAre.webp';

const stats = [
  { value: '16+', label: 'Years of Experience', icon: Clock },
  { value: '500+', label: 'Happy Travelers', icon: Users },
  { value: '2', label: 'Destinations', icon: Globe },
  { value: '98%', label: 'Satisfaction Rate', icon: Award },
];

const values = [
  {
    title: 'Personalized Journeys',
    description: 'Every itinerary is handcrafted to match your preferences, pace, and passions — no two trips are ever the same.',
  },
  {
    title: 'Local Expertise',
    description: 'Decades of on-the-ground knowledge in Sri Lanka and the Maldives give us an unmatched edge in crafting authentic experiences.',
  },
  {
    title: 'Nordic Standard',
    description: 'Rooted in Finland, we bring the precision, reliability, and quality expectations of Nordic travelers to every booking.',
  },
  {
    title: 'Fully Accredited',
    description: 'Registered with PATA Finland Chapter, KKV, and SMAL — you travel with a trusted, verified agency every step of the way.',
  },
];

const teamLeaders = [
  { name: 'Buddhika Gamage', role: 'Chief Executive Officer', image: buddhikaImg },
  { name: 'Primal Gamage', role: 'Operations Manager', image: primalImg },
];

export default function WhoWeAre() {
  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen">

      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={maldivesHero}
            alt="Who We Are - Simplifly Finland Oy"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layer overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041d3c]/85 via-[#041d3c]/55 to-[#041d3c]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/70 via-transparent to-[#041d3c]/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/14 text-white/75 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 backdrop-blur-sm">
            <span>✦ DISCOVER OUR STORY</span>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  drop-shadow-lg mb-5">
            Who We Are
          </h1>
          <div className="w-20 h-1.5 bg-[#D4AF37] rounded-full mb-5" />
          <p className="text-white/75 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed drop-shadow">
            Elevating tropical travel through unparalleled luxury, deep local expertise, and seamless personalization.
          </p>
        </div>
      </section>

      {/* ── ABOUT SECTION — split layout ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10 w-fit">
                <span>✦ ABOUT US</span>
              </div>
              <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
                About Simplifly<br />Finland Oy
              </h2>
              <div className="w-16 h-1.5 bg-[#1a84ff] rounded-full mb-7" />
              <p className="text-gray-600 text-[15px] lg:text-[16px] leading-[1.85] font-normal mb-5">
                Established to strengthen collaborations with Finnish and Nordic tour operators, Simplifly Finland Oy provides reliable local support, profound destination expertise, and innovative luxury travel solutions.
              </p>
              <p className="text-gray-600 text-[15px] lg:text-[16px] leading-[1.85] font-normal mb-8">
                We are dedicated to creating meaningful, long-lasting partnerships and curating deeply authentic experiences tailored to the high expectations of Nordic travelers seeking the true essence of Sri Lanka and the Maldives.
              </p>
            </div>

            {/* Right — stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-white rounded-[20px] p-6 lg:p-7 shadow-[0_4px_24px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_40px_rgba(4,29,60,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group"
                >
                  <div className="w-11 h-11 rounded-[12px] bg-[#1a84ff]/8 border border-[#1a84ff]/10 flex items-center justify-center group-hover:bg-[#1a84ff]/12 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#1a84ff]" />
                  </div>
                  <div>
                    <p className="text-[#041d3c] font-black text-[36px] lg:text-[42px] leading-none mb-1">{value}</p>
                    <p className="text-gray-500 text-[12px] font-extrabold uppercase tracking-wider leading-snug">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO THOUGHT SECTION ── */}
      <section className="w-full bg-[#041d3c] py-[100px] lg:py-[120px] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(26,132,255,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.05)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — CEO image */}
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-[28px] border border-[#1a84ff]/20 z-0" />
              <div className="relative rounded-[24px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.3)] aspect-[4/5] z-10 group">
                <ImageWithFallback
                  src={ceoImg}
                  alt="Buddhika Gamage - CEO"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                {/* Name tag overlay */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-[14px] px-5 py-4">
                  <p className="text-white font-black text-[16px] leading-tight">Buddhika Gamage</p>
                  <p className="text-white/55 text-[11px] font-extrabold uppercase tracking-widest mt-0.5">Chief Executive Officer</p>
                </div>
              </div>
            </div>

            {/* Right — quote */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/70 font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-5 w-fit">
                <span>✦ CEO'S MESSAGE</span>
              </div>
              <h2 className="text-white font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-6">
                A Vision for<br />Luxury
              </h2>
              <div className="w-16 h-1.5 bg-[#D4AF37] rounded-full mb-8" />

              {/* Quote block */}
              <div className="relative">
                <Quote className="absolute -top-3 -left-2 w-12 h-12 text-[#1a84ff]/20 rotate-180" />
                <blockquote className="text-white/70 text-[15px] lg:text-[16px] leading-[1.85] font-normal italic pl-6 border-l-2 border-[#D4AF37]/40">
                  "With over 16 years of experience, we don't just book vacations — we architect lifelong memories. We've built a strong reputation in promoting the Maldives and Sri Lanka, curating seamless, luxurious journeys perfectly tailored to the high expectations of Nordic travelers and beyond. Flawless execution is the hallmark of true luxury, and we ensure that every logistical detail is invisible to our guests."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ WHAT DRIVES US</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Our Core Values
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-2xl leading-relaxed">
              The principles that guide every journey we craft and every relationship we build.
            </p>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[20px] p-7 lg:p-8 shadow-[0_4px_24px_rgba(4,29,60,0.05)] hover:shadow-[0_12px_40px_rgba(4,29,60,0.09)] hover:-translate-y-1 transition-all duration-300 group flex gap-5"
              >
                <div className="shrink-0 w-10 h-10 rounded-[12px] bg-[#1a84ff]/8 border border-[#1a84ff]/10 flex items-center justify-center group-hover:bg-[#1a84ff]/12 transition-colors duration-300 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-[#1a84ff]" />
                </div>
                <div>
                  <h3 className="text-[#041d3c] font-black text-[18px] mb-2 leading-snug">{value.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-[1.75] font-normal">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="w-full bg-[#f8fafc] py-[80px] lg:py-[100px]">
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ DISCOVER SIMPLIFLY</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Experience Our World
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full" />
          </div>

          <div className="relative w-full rounded-[24px] overflow-hidden shadow-[0_30px_70px_rgba(4,29,60,0.15)] aspect-video bg-[#041d3c] max-w-5xl mx-auto">
            <iframe
              src="https://www.youtube.com/embed/w9tzrtut3Wc?autoplay=0&rel=0&showinfo=0"
              title="Simplifly Finland Oy"
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── TRUSTED PARTNERS ── */}
      <BrandLogos />

      {/* ── TEAM LEADERS ── */}
      <section className="w-full py-[100px] lg:py-[120px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-4 border border-[#1a84ff]/10">
              <span>✦ THE PEOPLE BEHIND THE MAGIC</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight  mb-4">
              Meet Our Team
            </h2>
            <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
            <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
              The passionate experts behind every seamless journey we deliver.
            </p>
          </div>

          {/* Team cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamLeaders.map((leader, idx) => (
              <div key={idx} className="group relative">
                {/* Card */}
                <div className="relative rounded-[24px] overflow-hidden shadow-[0_8px_32px_rgba(4,29,60,0.08)] hover:shadow-[0_20px_60px_rgba(4,29,60,0.14)] transition-all duration-500">
                  {/* Photo */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <ImageWithFallback
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient fade at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041d3c]/90 via-[#041d3c]/20 to-transparent" />

                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-black text-[20px] lg:text-[22px] leading-tight mb-1">{leader.name}</h3>
                    <p className="text-white/55 text-[11px] font-extrabold uppercase tracking-[0.2em]">{leader.role}</p>
                    {/* Accent line */}
                    <div className="w-0 group-hover:w-10 h-[2px] bg-[#D4AF37] rounded-full mt-3 transition-all duration-500 ease-out" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
