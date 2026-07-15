"use client";

import React from 'react';

export function PackageSkeleton() {
  return (
    <div className="w-full bg-[#f8fafc] flex flex-col font-poppins min-h-screen animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[62vh] min-h-[500px] flex items-end overflow-hidden bg-gray-200">
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 pb-12 lg:pb-16 space-y-4">
          <div className="h-4 w-16 bg-white/40 rounded mb-6"></div>
          <div className="h-6 w-48 bg-white/40 rounded-full mb-5"></div>
          <div className="h-12 w-3/4 max-w-2xl bg-white/40 rounded"></div>
          <div className="h-12 w-2/4 max-w-lg bg-white/40 rounded mb-4"></div>
          <div className="w-20 h-1.5 bg-[#D4AF37]/40 rounded-full mb-5"></div>
          <div className="flex gap-5">
            <div className="h-5 w-24 bg-white/40 rounded"></div>
            <div className="h-5 w-24 bg-white/40 rounded"></div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 lg:items-start">
          
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-14">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="w-14 h-1.5 bg-gray-200 rounded-full mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(4,29,60,0.05)] border border-[#041d3c]/5 overflow-hidden h-[400px] flex flex-col">
              <div className="h-[220px] w-full bg-gray-200"></div>
              <div className="p-7 space-y-5 flex-1">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-[1px] w-full bg-gray-100"></div>
                <div className="h-12 w-full bg-gray-200 rounded-[14px]"></div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
