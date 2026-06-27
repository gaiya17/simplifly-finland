import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.dial.includes(search)
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#f8fafc] border ${error ? 'border-red-400' : 'border-[#e4eaf2]'} rounded-[12px] px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#1a84ff] transition-colors cursor-pointer flex items-center justify-between`}
        style={{ color: selectedCountry ? '#041d3c' : '#9ca3af' }}
      >
        <span>{selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Country *'}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-[#e4eaf2] rounded-[12px] shadow-lg overflow-hidden">
          <div className="flex items-center px-3 py-2 border-b border-[#e4eaf2] bg-[#f8fafc]">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search country..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-[13px] text-[#041d3c]"
              autoFocus
            />
          </div>
          <div className="max-h-[220px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(c => (
                <div 
                  key={c.code}
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="px-4 py-2.5 hover:bg-[#f0f5ff] cursor-pointer text-[13px] text-[#041d3c] flex items-center transition-colors"
                >
                  <span className="mr-2 text-base">{c.flag}</span>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-auto text-gray-400 text-[11px] font-semibold">{c.dial}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-[13px] text-gray-400 text-center">No countries found</div>
            )}
          </div>
        </div>
      )}
      
      {error && <span className="text-red-500 text-[10px] font-bold mt-1 block px-1">{error}</span>}
    </div>
  );
};
