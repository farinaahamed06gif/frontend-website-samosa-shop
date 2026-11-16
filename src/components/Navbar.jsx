import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { ATELIER_SPECS } from '../data/samosaData';

export default function Navbar({ cartCount, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#08090b]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Atelier Brandmark */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 flex items-center justify-center shadow-glow-warm">
              <div className="w-full h-full bg-[#0d0f12] rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 fill-current group-hover:scale-110 transition-transform">
                  <polygon points="12,3 2,21 22,21" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-display font-bold tracking-wider text-base text-white block leading-tight">
                THE SAMOSA ATELIER
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                GEOMETRY & FLAVOUR LAB
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#3d-viewport" className="hover:text-amber-400 transition-colors">
              3D Specimen
            </a>
            <a href="#flavour-matrix" className="hover:text-amber-400 transition-colors">
              Formulation
            </a>
            <a href="#acoustics" className="hover:text-amber-400 transition-colors">
              Acoustic Physics
            </a>
            <a href="#menu-order" className="hover:text-amber-400 transition-colors">
              Atelier Menu
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              Contact & Atelier
            </a>
          </nav>

          {/* Actions & Live Telemetry */}
          <div className="flex items-center gap-3">
            {/* Live fryer status pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>FRYER 182°C</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">BATCH #14</span>
            </div>

            {/* Direct Email link */}
            <a 
              href={`mailto:${ATELIER_SPECS.contact.email}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
              title="Concierge Email"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{ATELIER_SPECS.contact.email}</span>
            </a>

            {/* Bag / Order trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wide transition-all shadow-glow-warm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Order Batch</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-black text-amber-400 text-[10px] font-mono flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

