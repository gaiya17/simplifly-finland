import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../../imports/simplifly_sri_lanka1.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 h-20 px-12 lg:px-24 flex items-center justify-between z-50 transition-all duration-300 py-4 ${
        isScrolled ? 'bg-[#041d3c] shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* LEFT: Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img 
            src={logo} 
            alt="Simplifly Sri Lanka" 
            className="h-12 w-auto transition-all duration-300 brightness-0 invert" 
          />
        </Link>
      </div>

      {/* CENTER: Navigation Links */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center h-full gap-8">
        <div className="relative group h-full flex items-center">
          <Link to="/maldives-resorts" className="flex items-center gap-1.5 font-medium hover:-translate-y-1 transition-all text-sm py-2 text-white drop-shadow-lg">
            Maldives Resorts
            <ChevronDown className="w-4 h-4" />
          </Link>
          
          <div className="absolute top-[80%] left-0 mt-2 bg-[#041d3c] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] py-3 min-w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out border border-white/10 z-50 translate-y-2 group-hover:translate-y-0">
            {[
              "All Inclusive Resorts",
              "Family Friendly Resorts",
              "Honeymoon Resorts",
              "Luxury & Ultra Luxury Resorts",
              "Best for Diving & Snorkeling",
              "Surfing Resorts",
              "Wellness & Spa Retreat Resorts",
              "The Full Collection"
            ].map((item) => (
              <a href="#" key={item} className="block w-full text-left px-6 py-2.5 text-[15px] font-medium text-white hover:bg-[#f4f7fb]/10 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="relative group h-full flex items-center">
          <Link to="/sri-lanka-tours" className="flex items-center gap-1.5 font-medium hover:-translate-y-1 transition-all text-sm py-2 text-white drop-shadow-lg">
            Sri Lankan Tours
            <ChevronDown className="w-4 h-4" />
          </Link>

          <div className="absolute top-[80%] left-0 mt-2 bg-[#041d3c] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] py-3 min-w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out border border-white/10 z-50 translate-y-2 group-hover:translate-y-0">
            {[
              "Adventure & Nature Based Tours",
              "Culture & Heritage Tour",
              "Family Tours",
              "Wild Life Tours",
              "Romantic Tours",
              "Sustainable Tours",
              "Sports & Adventure Tours",
              "Wellness & Ayurveda Tours",
              "Sri Lanka +Maldives Tours"
            ].map((item) => (
              <a href="#" key={item} className="block w-full text-left px-6 py-2.5 text-[15px] font-medium text-white hover:bg-[#f4f7fb]/10 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <Link to="/who-we-are" className="font-medium hover:-translate-y-1 transition-all text-sm py-2 text-white drop-shadow-lg">
          Who We Are
        </Link>

        <Link to="/gallery" className="font-medium hover:-translate-y-1 transition-all text-sm py-2 text-white drop-shadow-lg">
          Gallery
        </Link>

        <Link to="/blog" className="font-medium hover:-translate-y-1 transition-all text-sm py-2 text-white drop-shadow-lg">
          Blog
        </Link>
      </nav>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 h-full">
        <div className="relative group h-full flex items-center">
          <button className="flex items-center gap-2 px-3 py-2 rounded-[16px] border transition-all text-sm font-medium hover:-translate-y-1 border-white/30 text-white bg-black/10 backdrop-blur-sm hover:bg-white/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-5 h-auto rounded-sm object-cover" />
            <span>English</span>
            <ChevronDown className="w-4 h-4 opacity-80" />
          </button>

          <div className="absolute top-[80%] right-0 mt-2 bg-[#041d3c] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.2)] py-3 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out border border-white/10 z-50 translate-y-2 group-hover:translate-y-0">
            {[
              { name: "Suomi", flag: "fi" },
              { name: "English", flag: "gb", active: true },
              { name: "Svenska", flag: "se" },
              { name: "Deutsch", flag: "de" },
              { name: "Français", flag: "fr" },
              { name: "Русский", flag: "ru" },
              { name: "Español", flag: "es" },
              { name: "Polski", flag: "pl" }
            ].map((lang) => (
              <button key={lang.name} className={`w-full flex items-center gap-3 px-6 py-2.5 text-[15px] hover:bg-[#f4f7fb]/10 transition-colors ${lang.active ? 'bg-[#f4f7fb]/10 text-white font-bold' : 'text-white font-medium'}`}>
                <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.name} className="w-5 h-auto rounded-sm object-cover shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button className="px-6 py-2.5 rounded-[16px] bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300">
          Contact Us
        </button>
      </div>
    </header>
  );
}
