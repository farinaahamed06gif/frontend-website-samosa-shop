import React from 'react';
import { ATELIER_SPECS } from '../data/samosaData';
import { Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050607] border-t border-white/10 py-16 text-zinc-500 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <polygon points="12,3 2,21 22,21" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-base tracking-wider">
                {ATELIER_SPECS.name}
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              A high-precision culinary laboratory pioneering 72-layer ghee laminated pastry geometry, calibrated thermal frying, and acoustic shatter science.
            </p>

            <div className="text-[11px] text-zinc-600">
              COORDINATES: {ATELIER_SPECS.address.coordinates} // SAN FRANCISCO
            </div>
          </div>

          {/* Quick Contact Col */}
          <div className="space-y-3">
            <span className="text-[11px] text-zinc-300 uppercase tracking-widest block">
              DIRECT DISPATCH
            </span>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <a href={`mailto:${ATELIER_SPECS.contact.email}`} className="hover:text-amber-400 transition-colors">
                  {ATELIER_SPECS.contact.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${ATELIER_SPECS.contact.ordersEmail}`} className="hover:text-amber-400 transition-colors">
                  {ATELIER_SPECS.contact.ordersEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${ATELIER_SPECS.contact.phone}`} className="hover:text-amber-400 transition-colors">
                  {ATELIER_SPECS.contact.phone}
                </a>
              </li>
              <li className="text-zinc-500 pt-1">
                {ATELIER_SPECS.address.line1}, {ATELIER_SPECS.address.city}
              </li>
            </ul>
          </div>

          {/* Standards & Certification */}
          <div className="space-y-3">
            <span className="text-[11px] text-zinc-300 uppercase tracking-widest block">
              OPERATIONAL COMPLIANCE
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-500">
              <li>ISO-Grade Pastry Lamination Specs</li>
              <li>Grass-Fed Cultured Ghee Formulation</li>
              <li>Continuous 182°C Thermocouple Monitoring</li>
              <li>Zero Trans-Fats // Zero Artificial Preservatives</li>
              <li>Compostable Mineral Thermal Packaging</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {ATELIER_SPECS.name}. All culinary and geometric formulations reserved.
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={`mailto:${ATELIER_SPECS.contact.email}`}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              <span>Contact Atelier Desk</span>
            </a>

            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

