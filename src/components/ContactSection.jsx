import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { ATELIER_SPECS } from '../data/samosaData';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    topic: 'Private Catering & Events',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulated instant frontend state response
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-24 bg-[#08090b] relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-amber-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>DIRECT CONCIERGE & ATELIER ACCESS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
            CONTACT & DISPATCH DESK
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
            For bespoke private tastings, catering arrangements, wholesale inquiries, or general culinary consultation, connect with our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Atelier Coordinates & Emails (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Primary Email Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#12151b] to-[#0b0c0f] border border-amber-500/30 relative shadow-glow-warm">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block mb-2">
                PRIMARY EMAIL DISPATCH
              </span>
              
              <a 
                href={`mailto:${ATELIER_SPECS.contact.email}`}
                className="text-lg sm:text-2xl font-mono font-bold text-white hover:text-amber-400 transition-colors block break-all mb-4"
              >
                {ATELIER_SPECS.contact.email}
              </a>

              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Direct route to our lead culinary engineer. Monitored continuously during active batch cycles. Response guaranteed within 2 operational hours.
              </p>

              <div className="space-y-2 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Kitchen Queue Direct:</span>
                  <a href={`mailto:${ATELIER_SPECS.contact.ordersEmail}`} className="text-amber-400 hover:underline">
                    {ATELIER_SPECS.contact.ordersEmail}
                  </a>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Press & Syndication:</span>
                  <a href={`mailto:${ATELIER_SPECS.contact.pressEmail}`} className="text-amber-400 hover:underline">
                    {ATELIER_SPECS.contact.pressEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Atelier Physical Location & Phone */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1115] border border-white/10 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                    PHYSICAL ATELIER & TASTING ROOM
                  </span>
                  <div className="font-display font-semibold text-white text-base mt-1">
                    {ATELIER_SPECS.address.line1}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {ATELIER_SPECS.address.district}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {ATELIER_SPECS.address.city}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400/80 mt-1">
                    {ATELIER_SPECS.address.coordinates}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                    VOICE CONCIERGE
                  </span>
                  <a 
                    href={`tel:${ATELIER_SPECS.contact.phone}`}
                    className="font-mono text-white text-sm hover:text-amber-400 transition-colors block mt-1"
                  >
                    {ATELIER_SPECS.contact.phone}
                  </a>
                  <span className="text-xs text-zinc-500 block">
                    Direct Kitchen Hotline: {ATELIER_SPECS.contact.hotline}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                    OPERATIONAL SERVICE WINDOWS
                  </span>
                  <div className="space-y-1.5 text-xs font-mono">
                    {ATELIER_SPECS.hours.map((h, i) => (
                      <div key={i} className="flex justify-between text-zinc-300">
                        <span className="text-zinc-500">{h.days}:</span>
                        <span>{h.times}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Digital Transmission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0f1115] border border-white/10 relative">
              
              <div className="mb-8">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  SECURE COMMUNIQUÉ
                </span>
                <h3 className="text-2xl font-display font-bold text-white">
                  Send a Direct Inquiry to the Kitchen
                </h3>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-display font-bold text-white">
                    Transmission Dispatched
                  </h4>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white">{formState.name}</span>. Your inquiry regarding <span className="text-amber-400">{formState.topic}</span> has reached the atelier desk. We will respond directly to <span className="text-white">{formState.email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', topic: 'Private Catering & Events', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-all"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2">
                        NAME / IDENTITY *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 block mb-2">
                        RETURN EMAIL *
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="elena@rostova.com"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-2">
                      INQUIRY CLASSIFICATION
                    </label>
                    <select
                      value={formState.topic}
                      onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="Private Catering & Events">Private Tasting & Event Catering (10 - 250 Guests)</option>
                      <option value="Tasting Room Reservation">Tasting Counter Reservation (Chef's 6-Course Flight)</option>
                      <option value="Culinary Press & Media">Culinary Press, Media & Architectural Review</option>
                      <option value="Wholesale Batch Supply">Wholesale Atelier Batch Distribution</option>
                      <option value="General Consultation">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-zinc-400 block mb-2">
                      SPECIFICATIONS & INSTRUCTIONS *
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Detail dates, guest count, dietary parameters, or custom flavour formulation requests..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] font-mono text-zinc-500">
                      SECURED // DIRECT ATELIER ROUTING
                    </span>

                    <button
                      type="submit"
                      disabled={loading}
                      className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-warm active:scale-95"
                    >
                      {loading ? (
                        <span>Transmitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Transmission</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

