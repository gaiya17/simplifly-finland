"use client";
import { Wallet, Percent, Award } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export function ServicesSection() {
  const { t } = useTranslation();
  const icons = [Wallet, Percent, Award];

  return (
    <section className="bg-transparent py-[40px] lg:py-[60px] w-full font-poppins relative">
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="bg-gradient-to-br from-[#f0f6ff] to-[#e6f1ff] rounded-[28px] p-8 md:p-10 lg:p-12 shadow-[0_12px_40px_rgba(4,29,60,0.02)] border border-[#1a84ff]/15 flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a84ff]/8 text-[#1a84ff] font-extrabold text-[10px] tracking-wider uppercase border border-[#1a84ff]/10">
              <span>{t.services.badge}</span>
            </div>
            <h2 className="text-[#041d3c] font-black text-2xl sm:text-2xl sm:text-3xl lg:text-[42px] ">
              {t.services.title}
            </h2>
          </div>

          <div className="h-[1px] bg-[#041d3c]/8 w-full my-2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
            {t.services.features.map((feature, i) => {
              const Icon = icons[i];
              return (
                <div key={i} className="flex items-start gap-4 group cursor-pointer">
                  <div className="w-[46px] h-[46px] rounded-[12px] bg-[#1a84ff]/8 border border-[#1a84ff]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-[20px] h-[20px] text-[#1a84ff]" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-[#041d3c] font-extrabold text-[18px] mb-1.5 ">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-[14px] leading-relaxed font-medium">
                      {feature.description}
                    </p>
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
