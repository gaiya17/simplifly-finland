import { Wallet, Percent, Award, ArrowUpRight } from 'lucide-react';

export function ServicesSection() {
  return (
    <section className="bg-transparent py-[40px] lg:py-[60px] w-full">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        
        {/* Main Card - Redesigned as a Compact CTA with a slightly darker blue background */}
        <div className="bg-[#e6eff9] rounded-[16px] p-8 lg:p-10 flex flex-col gap-8 shadow-sm border border-[#041d3c]/5">
          
          {/* Top Row: Title & CTA Button */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <h2 className="text-[#041d3c] font-bold text-[28px] md:text-[32px] tracking-tight">
              We're Providing Best Service !
            </h2>

            {/* Call to Action Button */}
            <button className="bg-[#1a84ff] hover:bg-[#1a84ff]/90 text-white rounded-full px-8 py-3.5 flex items-center justify-center gap-6 transition-colors shadow-[0_8px_20px_rgba(26,132,255,0.25)] shrink-0">
              <div className="flex items-center gap-1.5 font-bold text-[15px]">
                <ArrowUpRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
                Check Offer
              </div>
              <div className="font-semibold text-[15px] opacity-95 hidden sm:block">
                Flat 30% Discounts All Packages
              </div>
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-[1px] bg-[#041d3c]/10 w-full" />

          {/* Features Grid - Left Aligned and Highly Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-[#ffb900] flex items-center justify-center shrink-0 mt-0.5">
                <Wallet className="w-[20px] h-[20px] text-black" strokeWidth={2} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[#041d3c] font-bold text-[18px] mb-1.5">Saves Money</h3>
                <p className="text-gray-600 text-[14px] leading-[1.6]">
                  Avoids hidden fees & tourist traps. Multi-destination & budget-friendly options.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-[#00a2ff] flex items-center justify-center shrink-0 mt-0.5">
                <Percent className="w-[20px] h-[20px] text-black" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[#041d3c] font-bold text-[18px] mb-1.5">Deals & Discounts</h3>
                <p className="text-gray-600 text-[14px] leading-[1.6]">
                  Agencies have special discounts on flights, hotels, & complete travel packages.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-[#ffb900] flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-[20px] h-[20px] text-black" strokeWidth={2} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[#041d3c] font-bold text-[18px] mb-1.5">Local Guidance</h3>
                <p className="text-gray-600 text-[14px] leading-[1.6]">
                  Travel agencies provide experienced professionals for reliable local guidance.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}