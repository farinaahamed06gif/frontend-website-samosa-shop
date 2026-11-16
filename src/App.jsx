import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FlavorMatrix from './components/FlavorMatrix';
import AcousticEngineering from './components/AcousticEngineering';
import MenuOrder from './components/MenuOrder';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { SAMOSA_VARIANTS, ATELIER_SPECS } from './data/samosaData';
import { acousticSynthesizer } from './utils/audioSynthesizer';
import { ShoppingBag, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export default function App() {
  const [activeVariant, setActiveVariant] = useState(SAMOSA_VARIANTS[0]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Play procedural acoustic crunch
  const handlePlayCrunch = () => {
    acousticSynthesizer.playCrunch();
  };

  // Cart operations
  const handleAddToCart = (variant, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...variant, quantity }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartUnits = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f3f4f6] selection:bg-amber-500 selection:text-black">
      {/* Top Fixed Nav */}
      <Navbar 
        cartCount={totalCartUnits} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      <main>
        {/* Hero Section with Interactive 3D Canvas */}
        <Hero 
          activeVariant={activeVariant}
          onSelectVariant={setActiveVariant}
          onCrunchPlay={handlePlayCrunch}
          onOpenOrder={() => setIsCartOpen(true)}
        />

        {/* Acoustic Engineering & Shatter Physics */}
        <AcousticEngineering 
          onCrunchPlay={handlePlayCrunch} 
        />

        {/* Botanical Ingredients & Flavor Matrix */}
        <FlavorMatrix 
          onAddToCart={handleAddToCart}
          onSelectVariant={setActiveVariant}
          activeVariantId={activeVariant.id}
        />

        {/* Pre-Packaged Tasting Flights */}
        <section id="menu-order" className="py-20 bg-[#0b0c10] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
                  CURATED TASTING FLIGHTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  SIGNATURE TASTING BOXES
                </h2>
              </div>
              <p className="text-xs font-mono text-zinc-400 max-w-sm">
                Each flight arrives in custom thermal-insulated mineral board packaging engineered to preserve the 64 dB acoustic crunch for up to 90 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Flight 1 */}
              <div className="p-6 rounded-2xl bg-[#0f1115] border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-500 mb-2">
                    <span>FLIGHT NO. 01</span>
                    <span className="text-amber-400 font-bold">$19.50</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    The Atelier Flight (4 Pieces)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    1 of each signature formulation: Heritage Russet, Truffle Malai, Smoked Jackfruit, and Charred Corn Habanero. Accompanied by 2 handcrafted emulsions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    SAMOSA_VARIANTS.forEach((v) => handleAddToCart(v, 1));
                    setIsCartOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500 hover:text-black border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order 4-Piece Flight</span>
                </button>
              </div>

              {/* Flight 2 */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#13161c] to-[#0c0d10] border border-amber-500/40 flex flex-col justify-between shadow-glow-warm">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-amber-400 mb-2">
                    <span className="font-bold">MASTER SELECTION</span>
                    <span className="text-amber-400 font-bold">$38.00</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    The Degustation Crate (8 Pieces)
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    2 of each signature formulation with full flight of 3 dipping emulsions (Tamarind Date Glaze, Wild Mint Emulsion, Fermented Garlic Crisp).
                  </p>
                </div>
                <button
                  onClick={() => {
                    SAMOSA_VARIANTS.forEach((v) => handleAddToCart(v, 2));
                    setIsCartOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-warm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order 8-Piece Crate</span>
                </button>
              </div>

              {/* Flight 3 */}
              <div className="p-6 rounded-2xl bg-[#0f1115] border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-500 mb-2">
                    <span>SALON BATCH</span>
                    <span className="text-amber-400 font-bold">$54.00</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    The Grand Salon Batch (12 Pieces)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Architectural party presentation box with 3 units of each signature formulation, double chutney set, and complimentary spice finishing salts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    SAMOSA_VARIANTS.forEach((v) => handleAddToCart(v, 3));
                    setIsCartOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500 hover:text-black border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order 12-Piece Batch</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Dispatch Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Order Drawer */}
      <MenuOrder 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

