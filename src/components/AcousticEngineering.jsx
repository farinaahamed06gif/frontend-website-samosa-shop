import React, { useState } from 'react';
import { Volume2, Activity, Play, Zap, CheckCircle2 } from 'lucide-react';

export default function AcousticEngineering({ onCrunchPlay }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTestAcoustic = () => {
    setIsPlaying(true);
    if (onCrunchPlay) onCrunchPlay();
    setTimeout(() => setIsPlaying(false), 800);
  };

  return (
    <section id="acoustics" className="py-24 bg-[#0a0b0e] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>LABORATORY BENCHMARK // DECIBEL SHATTER DYNAMICS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              ACOUSTIC FREQUENCY <br />
              <span className="text-zinc-400">OF THE FIRST BITE</span>
            </h2>
          </div>

          <div className="max-w-md text-sm text-zinc-400 leading-relaxed font-normal">
            Sound is taste. When an uncompressed 72-layer laminated crust fractures under bite force, it produces a harmonic resonance between 2,200 Hz and 4,800 Hz — the neurological trigger for perceived freshness.
          </div>
        </div>

        {/* Acoustic Waveform Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Ordinary High Street Samosa */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1014] border border-white/5 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                  CONTROL SPECIMEN
                </span>
                <h3 className="text-xl font-display font-semibold text-zinc-300">
                  Standard Street Samosa
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-400">
                32 dB (Dull / Doughy)
              </span>
            </div>

            {/* Damped Waveform Illustration */}
            <div className="h-32 bg-black/40 rounded-xl border border-white/5 p-4 flex items-center justify-center relative overflow-hidden mb-6">
              <div className="w-full flex items-center justify-between gap-1 h-20 opacity-40">
                {[12, 18, 28, 42, 38, 25, 18, 14, 10, 8, 6, 5, 8, 12, 16, 20, 18, 12, 8, 6].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-zinc-600 rounded-full transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[11px] font-mono text-zinc-500 bg-black/80 px-2 py-0.5 rounded">
                  LOW FREQUENCY DAMPING // OIL SATURATION
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span>Heavy doughy base seams (&gt; 4.5mm wall thickness)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span>Excess oil retention; crust collapses within 12 minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span>Muffled bite compression at ~400 Hz</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Samosa Atelier Specimen */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#12141a] to-[#0c0e12] border border-amber-500/30 relative shadow-glow-warm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  ATELIER SPECIMEN // FORMULA 2026
                </span>
                <h3 className="text-xl font-display font-semibold text-white">
                  72-Layer Laminated Specimen
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                64 dB (Crisp Shatter)
              </span>
            </div>

            {/* Sharp High-Frequency Harmonic Waveform */}
            <div className="h-32 bg-black/60 rounded-xl border border-amber-500/20 p-4 flex items-center justify-center relative overflow-hidden mb-6">
              <div className="w-full flex items-center justify-between gap-1 h-20">
                {[15, 35, 85, 95, 78, 65, 88, 92, 45, 70, 85, 40, 60, 30, 45, 20, 15, 25, 10, 5].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlaying ? 'bg-amber-400 shadow-glow-warm' : 'bg-amber-500/80'
                    }`}
                    style={{ height: `${isPlaying ? Math.min(100, h * 1.25) : h}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[11px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-500/30">
                  3.2 kHz HARMONIC RESONANCE SHATTER
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs font-mono text-zinc-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Uniform 1.8mm pastry envelope across all 3 vertices</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Vapor release vents prevent interior crust softening</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Audible acoustic fracture verified up to 90 minutes post-fry</span>
              </li>
            </ul>

            <button
              onClick={handleTestAcoustic}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-glow-warm"
            >
              <Volume2 className="w-4 h-4" />
              <span>Synthesize Pastry Fracture Sound</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
