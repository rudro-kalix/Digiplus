import React, { useState } from 'react';
import { CartItem } from '../types';
import { CheckCircle2, Lock, Loader2, Mail, Smartphone } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  cartItems,
  onSuccess
}) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('details');
        setEmail('');
        setSenderNumber('');
        setTrxId('');
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  const methods: { id: PaymentMethod; name: string; color: string }[] = [
    { id: 'bkash', name: 'বিকাশ', color: 'bg-pink-600 hover:bg-pink-500' },
    { id: 'nagad', name: 'নগদ', color: 'bg-orange-600 hover:bg-orange-500' },
    { id: 'rocket', name: 'রকেট', color: 'bg-purple-600 hover:bg-purple-500' },
    { id: 'upay', name: 'উপায়', color: 'bg-blue-600 hover:bg-blue-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        
        {step === 'details' && (
          <form onSubmit={handlePay} className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-green-500" size={24} />
              নিরাপদ চেকআউট
            </h2>

            <div className="mb-6 space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>অর্ডার সারাংশ</span>
                  <span>{cartItems.length} টি আইটেম</span>
                </div>
                <div className="text-2xl font-bold text-white">৳{total.toLocaleString('bn-BD')}</div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">ইমেইল অ্যাড্রেস</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল দিন"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">এই ইমেইলে আপনার অ্যাকাউন্টের বিবরণ পাঠানো হবে।</p>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">পেমেন্ট মেথড সিলেক্ট করুন</label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`py-2 rounded-lg text-xs font-bold text-white transition-all ${m.id === method ? m.color + ' ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4 text-sm text-slate-300">
                   অনুগ্রহ করে <span className="font-bold text-white">01700000000</span> নম্বরে সেন্ড মানি করুন।
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            required 
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">TrxID</span>
                        <input 
                            type="text" 
                            required 
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="ট্রানজ্যাকশন আইডি (TrxID)"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 text-slate-400 hover:text-white font-medium transition-colors"
              >
                বাতিল
              </button>
              <button 
                type="submit"
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
              >
                পেমেন্ট করুন ৳{total.toLocaleString('bn-BD')}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">পেমেন্ট যাচাই করা হচ্ছে</h3>
            <p className="text-slate-400">আপনার ডিজিটাল সাবস্ক্রিপশন প্রস্তুত করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">অর্ডার সফল হয়েছে!</h3>
            <p className="text-slate-400 mb-6">আপনার সাবস্ক্রিপশন তথ্য ({email}) ইমেইলে পাঠানো হয়েছে।</p>
            <p className="text-xs text-slate-600">রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        )}
      </div>
    </div>
  );
};