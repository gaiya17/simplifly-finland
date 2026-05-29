import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import smalLogo from '../../imports/images-Picsart-AiImageEnhancer-copy.jpg';
import pataLogo from '../../imports/pata-finland-chapter.jpg';
import kkvLogo from '../../imports/TRANS2.jpg';

export function Footer() {
  return (
    <footer className="bg-[#041d3c] text-white pt-24 pb-12 border-t border-[#041d3c]/10">
      <div className="w-full max-w-screen-2xl mx-auto px-12 lg:px-24">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] gap-8 lg:gap-12 lg:gap-x-16 mb-20">
          
          {/* GENERAL */}
          <div className="flex flex-col">
            <h4 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">General</h4>
            <ul className="flex flex-col gap-5 text-sm">
              <li><Link to="/" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Home</Link></li>
              <li><Link to="/who-we-are" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Who We Are</Link></li>
              <li><a href="#" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Sri Lankan Tours</a></li>
              <li><a href="#" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Maldives Resorts</a></li>
              <li><Link to="/blog" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Blog</Link></li>
              <li><Link to="/gallery" className="text-gray-300 font-medium hover:text-white transition-colors duration-300 inline-block hover:-translate-y-1">Gallery</Link></li>
            </ul>
          </div>

          {/* FIND US IN EUROPE */}
          <div className="flex flex-col">
            <h4 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">Find Us in Europe</h4>
            <ul className="flex flex-col gap-5 text-gray-300 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                <span>Kardinaalinkatu 4C 20, 20540, Tukru, Finland</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <span>+358 40 8193030</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <span>+358 40 819 2758</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-gray-400" />
                <a href="mailto:sales@simpliflyfinland.fi" className="hover:text-white transition-colors">sales@simpliflyfinland.fi</a>
              </li>
            </ul>
          </div>

          {/* FIND US IN MALDIVES */}
          <div className="flex flex-col">
            <h4 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">Find Us in Maldives</h4>
            <ul className="flex flex-col gap-5 text-gray-300 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                <span>H Aagadhage, Aagadhage Building, Boduthakurufaanu Magu, Malé 20026, Maldives.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <span>+94 76 342 7054</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-gray-400" />
                <a href="mailto:sales@simpliflymaldives.com" className="hover:text-white transition-colors">sales@simpliflymaldives.com</a>
              </li>
            </ul>
          </div>

          {/* FIND US IN SRI LANKA */}
          <div className="flex flex-col">
            <h4 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">Find Us in Sri Lanka</h4>
            <ul className="flex flex-col gap-5 text-gray-300 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gray-400" />
                <span>Simplifly Lanka (Pvt) Ltd, No. 46/15, Samanala Mawatha, Athurugiriya, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <span>+94 76 342 7054</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                <span>+94 77 227 8407</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-gray-400" />
                <a href="mailto:sales@simpliflysrilanka.com" className="hover:text-white transition-colors">sales@simpliflysrilanka.com</a>
              </li>
            </ul>
          </div>

          {/* CERTIFICATIONS */}
          <div className="flex flex-col">
            <h4 className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-8">Certifications</h4>
            <div className="flex flex-col items-start gap-6">
              <ImageWithFallback 
                src={kkvLogo} 
                alt="KKV Registration" 
                className="h-10 w-auto object-contain mix-blend-screen"
              />
              <ImageWithFallback 
                src={smalLogo} 
                alt="SMAL Tunnus" 
                className="h-10 w-auto object-contain mix-blend-screen"
              />
              <div className="bg-white rounded-sm overflow-hidden py-1.5 px-2 flex items-center justify-center">
                <ImageWithFallback 
                  src={pataLogo} 
                  alt="PATA Finland Chapter" 
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-sm text-gray-400">
          <div className="tracking-wide text-center md:text-left">
            Copyright © 2026 simpliflyfinland.fi | Powered by simpliflyfinland.fi
          </div>
          <div className="flex gap-4 justify-center">
            <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white hover:-translate-y-1 transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white hover:-translate-y-1 transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:border-white hover:-translate-y-1 transition-all duration-300">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
          <div className="flex gap-8 font-medium justify-center md:justify-end">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
