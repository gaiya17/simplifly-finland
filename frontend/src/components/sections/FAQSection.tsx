"use client";
import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export function FAQSection() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number | null>(1);

  const trustIcons = [Shield, Clock, HelpCircle];

  return (
    <section className="w-full py-[100px] lg:py-[120px] font-poppins relative overflow-hidden bg-[#f8fafc]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(26,132,255,0.05)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(4,29,60,0.03)_0%,_transparent_70%)] pointer-events-none z-0" />

      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] lg:text-[11px] tracking-wider uppercase mb-3.5 shadow-sm border border-[#1a84ff]/10">
            <HelpCircle className="w-3 h-3" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] leading-tight mb-4 ">
            {t.faq.title}
          </h2>
          <div className="w-20 h-1.5 bg-[#1a84ff] rounded-full mb-5" />
          <p className="text-gray-500 text-[15px] lg:text-[16px] font-medium max-w-2xl leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.65fr] gap-8 xl:gap-12 items-start">
          {/* LEFT PANEL */}
          <div className="relative rounded-[28px] bg-[#041d3c] overflow-hidden p-8 xl:p-10 flex flex-col gap-8 lg:sticky lg:top-28 shadow-[0_30px_70px_rgba(4,29,60,0.18)]">
            <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-[radial-gradient(circle,_rgba(26,132,255,0.15)_0%,_transparent_65%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle,_rgba(26,132,255,0.08)_0%,_transparent_65%)] pointer-events-none" />

            <div className="inline-flex w-fit items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/80 font-extrabold text-[10px] tracking-wider uppercase">
              <span>{t.faq.helpBadge}</span>
            </div>

            <div>
              <h3 className="text-white font-black text-[26px] xl:text-[30px] leading-tight mb-3 relative z-10">
                {t.faq.helpTitle}
              </h3>
              <p className="text-white/60 text-[14px] leading-relaxed font-medium relative z-10">
                {t.faq.helpSubtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {t.faq.stats.map((stat) => (
                <div key={stat.label} className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-[16px] p-3 xl:p-4 text-center">
                  <p className="text-white font-black text-[20px] xl:text-[22px] leading-none mb-1">{stat.value}</p>
                  <p className="text-white/50 text-[10px] font-extrabold uppercase tracking-wider leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Trust items */}
            <div className="flex flex-col gap-3 relative z-10">
              {t.faq.trustItems.map((text, i) => {
                const Icon = trustIcons[i];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a84ff]/15 border border-[#1a84ff]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#1a84ff]" />
                    </div>
                    <span className="text-white/75 text-[13px] font-medium">{text}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-[1px] bg-white/8 w-full relative z-10" />

            <a
              href="https://wa.me/358408192758"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-extrabold px-6 py-3.5 rounded-[14px] text-[13px] uppercase tracking-wider shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 transition-all duration-300 group w-full text-center"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.faq.whatsappUs}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* RIGHT ACCORDION */}
          <div className="flex flex-col gap-3">
            {t.faq.questions.map((faq, index) => {
              const isOpen = openId === index + 1;
              return (
                <div
                  key={index}
                  className={`rounded-[18px] transition-all duration-400 ease-out overflow-hidden cursor-pointer group
                    ${isOpen
                      ? 'bg-white shadow-[0_8px_32px_rgba(4,29,60,0.08)] ring-1 ring-[#1a84ff]/15'
                      : 'bg-white/70 hover:bg-white shadow-[0_2px_12px_rgba(4,29,60,0.04)] hover:shadow-[0_6px_24px_rgba(4,29,60,0.07)]'
                    }`}
                  onClick={() => setOpenId(isOpen ? null : index + 1)}
                >
                  <div className="flex items-center gap-4 px-6 py-5">
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300
                        ${isOpen
                          ? 'bg-[#1a84ff] text-white shadow-[0_4px_12px_rgba(26,132,255,0.35)]'
                          : 'bg-[#f0f4f8] text-[#041d3c]/40 group-hover:bg-[#e8eef5]'
                        }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={`flex-1 text-[15px] md:text-[16px] font-bold leading-snug transition-colors duration-300 ${isOpen ? 'text-[#041d3c]' : 'text-gray-700 group-hover:text-[#041d3c]'}`}>
                      {faq.question}
                    </h3>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#1a84ff]/10 text-[#1a84ff] rotate-180' : 'bg-[#f0f4f8] text-gray-400 group-hover:bg-[#e8eef5] rotate-0'}`}>
                      <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mx-6 h-[1px] bg-[#1a84ff]/10 mb-4" />
                    <div className="px-6 pb-6 pl-[4.25rem]">
                      <p className="text-gray-600 text-[14px] md:text-[15px] font-normal leading-[1.8] whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
