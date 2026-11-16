import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Shield 
} from 'lucide-react';
import { ATELIER_SPECS } from '../data/samosaData';

export default function MenuOrder({ isOpen, onClose, cart, onUpdateQuantity, onClearCart }) {
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupTime, setPickupTime] = useState('Immediate Fresh Drop (18 min)');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const randomId = 'ATELIER-' + Math.floor(100000 + Math.random() * 900000);
    setOrderRef(randomId);
    setOrderComplete(true);
  };

  const handleResetOrder = () => {
    onClearCart();
    setOrderComplete(false);
    setCustomerName('');
    setCustomerEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-[#0d0f13] border-l border-white/10 h-full overflow-y-auto flex flex-col shadow-2xl z-10">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0d0f13]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Current Batch Order
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                DIRECT ATELIER KITCHEN QUEUE
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          {orderComplete ? (
            /* Order Success State */
            <div className="py-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-glow-warm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
                  ORDER COMMITTED TO FRYER QUEUE
                </span>
                <h4 className="text-2xl font-display font-bold text-white mb-2">
                  Batch Reserved Successfully
                </h4>
                <div className="inline-block px-3 py-1 rounded bg-black/60 border border-white/10 font-mono text-sm text-zinc-300">
                  REF: <span className="text-amber-400 font-bold">{orderRef}</span>
                </div>
              </div>

              <div className="bg-[#13161c] p-4 rounded-xl border border-white/10 text-left text-xs font-mono space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">GUEST:</span>
                  <span>{customerName || 'Atelier Guest'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">DISPATCH STATUS:</span>
                  <span className="text-amber-400">Dropping in Ghee (182°C)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">READY CADENCE:</span>
                  <span>{pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">PICKUP LOCATION:</span>
                  <span>{ATELIER_SPECS.address.line1}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-white font-bold">
                  <span>TOTAL CHARGE:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Confirmation telemetry dispatched to <span className="text-white">{customerEmail || ATELIER_SPECS.contact.email}</span>. Please present your reference token upon collection.
              </p>

              <button
                onClick={handleResetOrder}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all"
              >
                Complete & Reset
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-600 mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-mono text-zinc-500">
                Batch queue is empty. Select formulations from the 3D viewport or matrix.
              </p>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl bg-[#12151b] border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-white text-sm">
                      {item.name}
                    </h4>
                    <span className="text-xs font-mono text-zinc-400 block">
                      ${item.price.toFixed(2)} / unit · {item.acousticCrunch}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-black/50 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono text-amber-400 font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-mono font-bold text-white min-w-[50px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Order form details */}
              <form onSubmit={handleCheckout} className="pt-6 border-t border-white/10 space-y-4">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  Guest Reservation Telemetry
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                      FULL NAME
                    </label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alistair Thorne"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                      CONFIRMATION EMAIL
                    </label>
                    <input 
                      type="email" 
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. alistair@domain.com"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                      DESIRED COLLECTION WINDOW
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-[#12151b] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Immediate Fresh Drop (18 min)">Immediate Fresh Drop (18 min)</option>
                      <option value="Next Drop (36 min)">Next Drop (36 min)</option>
                      <option value="Evening Tasting (18:00)">Evening Tasting (18:00)</option>
                      <option value="Night Tasting (20:30)">Night Tasting (20:30)</option>
                    </select>
                  </div>
                </div>

                {/* Subtotal & Totals */}
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono pt-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>SUBTOTAL</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>STATE SALES TAX (8.5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>THERMAL INSULATED CRATE</span>
                    <span className="text-emerald-400">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                    <span>TOTAL</span>
                    <span className="text-amber-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-glow-warm active:scale-[0.98]"
                >
                  <span>Submit Kitchen Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

