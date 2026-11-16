import React, { useState } from 'react';
import { SAMOSA_VARIANTS } from '../data/samosaData';
import { Plus, Check, Info, Droplet } from 'lucide-react';

export default function FlavorMatrix({ onAddToCart, onSelectVariant, activeVariantId }) {
  const [selectedChutney, setSelectedChutney] = useState('tamarind');
  const [addedItem, setAddedItem] = useState(null);

  const chutneys = [
    {
      id: 'tamarind',
      name: '24-Hour Medjool Tamarind Glaze',
      flavorProfile: 'Sweet / Sour / Cumin Infused',
      acidity: 'pH 3.4',
      color: '#b45309'
    },
    {
      id: 'mint-coriander',
      name: 'Cold-Pressed Wild Mint & Cilantro',
      flavorProfile: 'Sharp Herbaceous / Lemon / Green Chili',
      acidity: 'pH 4.1',
      color: '#10b981'
    },
    {
      id: 'garlic-chili',
      name: 'Fermented Guntur Chili & Garlic Crisp',
      flavorProfile: 'Smoky Heat / Toasted Sesame / Umami',
      acidity: 'pH 4.8',
      color: '#ef4444'
    }
  ];

  const handleAdd = (variant) => {
    onAddToCart(variant);
    setAddedItem(variant.id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  return (
    <section id="flavour-matrix" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-amber-400 mb-3">
          <Info className="w-3.5 h-3.5" />
          <span>FLAVOUR ARCHITECTURE // 4 SIGNATURE FORMULATIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
          BOTANICALS & FORMULATIONS
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
          Every variant is formulated for balanced moisture control, preventing internal water release into the pastry during frying.
        </p>
      </div>

      {/* Grid of 4 Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {SAMOSA_VARIANTS.map((item) => {
          const isActiveIn3D = item.id === activeVariantId;
          const isRecentlyAdded = addedItem === item.id;

          return (
            <div 
              key={item.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                isActiveIn3D 
                  ? 'bg-gradient-to-br from-[#14161c] to-[#0c0d10] border-amber-500/40 shadow-glow-warm' 
                  : 'bg-[#0d0e12] border-white/5 hover:border-white/15'
              }`}
            >
              <div>
                {/* Top Row: Price & Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                      SPECIMEN NO. // {item.id.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-amber-400 block">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">PER UNIT</span>
                  </div>
                </div>

                <p className="text-xs font-mono text-amber-400/90 mb-4 pb-3 border-b border-white/5">
                  {item.subheading}
                </p>

                <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>

                {/* Botanical Ingredient Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.notes.map((note, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.03] border border-white/10 text-zinc-400"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono mb-6">
                  <div>
                    <span className="text-zinc-500 block">SPICE TIER</span>
                    <span className="text-white font-medium">{item.spiceScore}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CRUST WALL</span>
                    <span className="text-white font-medium">{item.crustThickness}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CRUNCH</span>
                    <span className="text-amber-400 font-medium">{item.acousticCrunch}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => onSelectVariant(item)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                    isActiveIn3D 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                      : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActiveIn3D ? 'Viewing in 3D' : 'Inspect in 3D'}
                </button>

                <button
                  onClick={() => handleAdd(item)}
                  className={`py-2.5 px-5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                    isRecentlyAdded
                      ? 'bg-emerald-500 text-black'
                      : 'bg-amber-500 hover:bg-amber-400 text-black shadow-glow-warm'
                  }`}
                >
                  {isRecentlyAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Batch</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Chutney Pairing Emulsion Bar */}
      <div className="bg-[#0f1115] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              <Droplet className="w-3.5 h-3.5 text-amber-400" />
              <span>Dipping Emulsion Chemistry</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Complimentary Handcrafted Dipping Emulsions
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            2 PRE-PACKED EMULSIONS PER ORDER OF 4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chutneys.map((chutney) => {
            const isSelected = selectedChutney === chutney.id;
            return (
              <div
                key={chutney.id}
                onClick={() => setSelectedChutney(chutney.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-white/[0.04] border-amber-500/40 shadow-sm' 
                    : 'bg-black/30 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chutney.color }} />
                  <span className="text-[10px] font-mono text-zinc-500">{chutney.acidity}</span>
                </div>
                <h4 className="font-display font-semibold text-white text-sm mb-1">
                  {chutney.name}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">
                  {chutney.flavorProfile}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

