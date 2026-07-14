"use client";
import { useSiteAssets } from '../providers/SiteAssetsProvider';
import Link from 'next/link';

export function SupportCTA() {
  const { getAssetUrl, isLoading } = useSiteAssets();
  const ctaBannerUrl = getAssetUrl('homepage_cta_offer_banner');

  return (
    <div className="w-full relative z-30 flex justify-center mt-[-55px] md:mt-[-70px] lg:mt-[-85px]">
      <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="w-full bg-gradient-to-r from-[#f0f6ff] to-[#e6f1ff] rounded-[20px] shadow-[0_20px_50px_rgba(26,132,255,0.08)] border border-[#1a84ff]/15 relative min-h-[140px] md:min-h-[180px] lg:min-h-[220px] px-6 sm:px-12 lg:px-24 py-7 sm:py-5 md:py-5 lg:py-6 flex items-center justify-between overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 xl:gap-8 items-center w-full h-full relative z-10 py-1">
            <div className={`col-span-1 ${ctaBannerUrl || isLoading ? 'md:col-span-5 lg:col-span-5 xl:col-span-5' : 'md:col-span-12 lg:col-span-12 xl:col-span-12'} flex flex-col justify-center items-center md:items-start text-center md:text-left`}>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a84ff]/10 text-[#1a84ff] font-extrabold text-[9px] lg:text-[10px] tracking-wider uppercase mb-2 shadow-sm border border-[#1a84ff]/10 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a84ff] animate-ping shrink-0" />
                <span>24/7 Premium Concierge</span>
              </div>
              <h2 className="text-[#041d3c] font-black text-[19px] sm:text-[22px] lg:text-[26px] leading-[1.2] mb-1.5 ">
                Our Team is Available <span className="text-[#1a84ff]">24 Hours, 7 Days</span>
              </h2>
              <p className="text-[#041d3c]/70 text-[11px] lg:text-[12.5px] font-semibold mb-3 lg:mb-3.5 leading-relaxed max-w-[400px]">
                Connect with our expert travel agents instantly on WhatsApp to plan your dream Maldives holiday.
              </p>
              <a 
                href="https://wa.me/358408192758?text=Hi%20Simplifly!%20I'm%20looking%20to%20plan%20a%20trip%20and%20would%20like%20some%20assistance."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white rounded-[12px] shadow-[0_8px_20px_rgba(7,94,84,0.2)] hover:shadow-[0_12px_28px_rgba(7,94,84,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-fit overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full rounded-[12px] border border-[#128c7e] animate-pulse opacity-60 group-hover:opacity-0 transition-opacity duration-300"></span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out z-0"></span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 group-hover:scale-110 group-hover:rotate-[12deg] transition-transform duration-300 relative z-10 shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-[12.5px] lg:text-[13.5px] font-bold tracking-wide relative z-10 whitespace-nowrap">+358 40 819 2758</span>
              </a>
            </div>
            {isLoading ? (
               <div className="col-span-1 md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center md:items-end w-full relative mt-6 md:mt-0">
                  <div className="w-[300px] sm:w-[350px] md:w-[380px] lg:w-[480px] xl:w-[560px] h-[150px] sm:h-[130px] md:h-[140px] lg:h-[170px] xl:h-[190px] rounded-[10px] bg-[#041d3c]/5 animate-pulse shrink-0"></div>
               </div>
            ) : ctaBannerUrl ? (
              <div className="col-span-1 md:col-span-7 lg:col-span-7 xl:col-span-7 flex flex-col justify-center items-center md:items-end w-full relative mt-6 md:mt-0">
                <Link href="/special-offers" className="w-[300px] sm:w-[350px] md:w-[380px] lg:w-[480px] xl:w-[560px] h-[150px] sm:h-[130px] md:h-[140px] lg:h-[170px] xl:h-[190px] rounded-[10px] overflow-hidden shadow-[0_4px_12px_rgba(4,29,60,0.06)] border border-[#041d3c]/5 shrink-0 bg-white relative block hover:scale-[1.02] transition-transform">
                  <img 
                    src={ctaBannerUrl} 
                    alt="Special Offers" 
                    className="w-full h-full object-cover select-none" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/4 to-white/8 pointer-events-none" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
