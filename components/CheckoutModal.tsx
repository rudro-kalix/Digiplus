import React, { useState } from 'react';
import { CartItem } from '../types';
import { CreditCard, CheckCircle2, Lock, Loader2, Mail } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  cartItems,
  onSuccess
}) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [email, setEmail] = useState('');
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('details'); // Reset for next time
        setEmail('');
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        
        {step === 'details' && (
          <form onSubmit={handlePay} className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-green-500" size={24} />
              Secure Checkout
            </h2>

            <div className="mb-6 space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Order Summary</span>
                  <span>{cartItems.length} items</span>
                </div>
                <div className="text-2xl font-bold text-white">${total.toFixed(2)}</div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Where should we send the code?"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">We'll send your login credentials here instantly.</p>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Card Details (Simulated)</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-3 opacity-75 cursor-not-allowed">
                   <CreditCard className="text-slate-500" />
                   <span className="text-slate-400 font-mono">•••• •••• •••• 4242</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 text-slate-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
              >
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
            <p className="text-slate-400">Please wait while we secure your digital key...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
            <p className="text-slate-400 mb-6">Check your email ({email}) for your subscription details.</p>
            <p className="text-xs text-slate-600">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};
