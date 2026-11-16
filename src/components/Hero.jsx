import React from 'react';
import SamosaCanvas3D from './SamosaCanvas3D';
import { SAMOSA_VARIANTS } from '../data/samosaData';
import { 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Thermometer, 
  Sparkles,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export default function Hero({ activeVariant, onSelectVariant, onCrunchPlay, onOpenOrder }) {
  return (
    <section id="3d-viewport" className="relative pt-28 pb-20 overflow-hidden tech-grid">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges & Meta */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-amber-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>PATENTED 72-LAYER GHEE LAMINATION // ZERO COMPROMISE CULINARY LAB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            THE ARCHITECTURE <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              OF ACOUSTIC CRUNCH
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
            Every samosa is engineered as an equilateral tetrahedral pressure vessel. 
            Crisped in temperature-monitored ghee to produce a shatter at exactly 64 decibels.
          </p>
        </div>

        {/* 3D Interactive Canvas Stage */}
        <div className="relative mb-10">
          <SamosaCanvas3D 
            activeVariant={activeVariant} 
            onCrunchPlay={onCrunchPlay} 
          />
        </div>

        {/* Specimen Variant Switcher Bar */}
        <div className="bg-[#0e1014] border border-white/10 rounded-2xl p-4 sm:p-6 mb-16 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Select Active 3D Specimen Formulation</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              BATCH #2026.04 // REAL-TIME GEOMETRY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMOSA_VARIANTS.map((variant) => {
              const isSelected = variant.id === activeVariant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => onSelectVariant(variant)}
                  className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-glow-warm' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-2xl flex items-start justify-end p-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  )}
                  
                  <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    {variant.acousticCrunch} // {variant.layers} Folds
                  </div>
                  
                  <div className="font-display font-semibold text-white text-base mb-1">
                    {variant.name}
                  </div>

                  <div className="text-xs text-zinc-400 line-clamp-1 mb-3">
                    {variant.subheading}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                    <span className="text-amber-400 font-bold">${variant.price.toFixed(2)}</span>
                    <span className="text-zinc-500 flex items-center gap-1 group-hover:text-zinc-300">
                      View 3D <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Core Structural Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111317] to-[#0a0b0d] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              72-Layer Lamination
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Cold-pressed cultured ghee folded between stone-milled flour sheets create microscopic air pockets that crisp uniformly in 182°C oil without greasiness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111317] to-[#0a0b0d] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              182°C Monitored Thermal Dip
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Calibrated dual-stage frying ensures the pastry crust hardens into a protective acoustic shield while the spiced filling inside steams gently at 84°C.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111317] to-[#0a0b0d] border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">
              Zero Soggy Seam Guarantee
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Traditional samosas gather excess dough at the base. Our hand-pleated scalloped seam guarantees an identical 1.8mm pastry wall thickness across all three vertices.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

