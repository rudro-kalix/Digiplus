import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CheckCircle2, Lock, Loader2, Mail, Smartphone, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';
type CheckoutStep = 'notice' | 'details' | 'processing' | 'success';

// 🔴 IMPORTANT: YOUR URL IS LIKELY INCORRECT
// 1. Go to your Google Form -> Click the "Eye" icon (Preview).
// 2. The URL in browser will be: https://docs.google.com/forms/d/e/1FAIpQLS..../viewform
// 3. Replace 'viewform' with 'formResponse'
// 4. The ID usually starts with "1FAIpQL..." (NOT "1HIg...")
const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeilqD7cVCR-Knafxicf3iQy-a3xt6N5W0JFS6zdvPtDzXF2g/formResponse';

const ENTRY_IDS = {
  email: 'entry.1148372080',        // Gmail Entry ID
  password: 'entry.169384476',      // Password Entry ID
  productName: 'entry.1051188277',  // Product Name Entry ID
  paymentMethod: 'entry.124185842', // Payment Method Entry ID
  senderNumber: 'entry.1348474470', // Sender Number Entry ID
  trxId: 'entry.614038957',         // TrxID Entry ID
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
    }
  }, [isOpen]);

  const total = product ? product.price : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the form from reloading the page
    setStep('processing');

    // Create form data to send
    const formData = new FormData();
    formData.append(ENTRY_IDS.email, email);
    formData.append(ENTRY_IDS.password, password);
    formData.append(ENTRY_IDS.productName, product?.name || '');
    formData.append(ENTRY_IDS.paymentMethod, method);
    formData.append(ENTRY_IDS.senderNumber, senderNumber);
    formData.append(ENTRY_IDS.trxId, trxId);

    try {
      // Use fetch with 'no-cors' mode to send data to Google Forms
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      // Show success after a short delay
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          // Reset form
          setEmail('');
          setPassword('');
          setSenderNumber('');
          setTrxId('');
          setStep('notice'); 
          onClose();
        }, 3000);
      }, 1000);

    } catch (error) {
      console.error("Form submission error:", error);
      alert("দুঃখিত, সাবমিশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setStep('details');
    }
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
                এই ধরনের পুরোপুরি পার্সোনাল সাবস্ক্রিপশন কোনো ধরনের শেয়ার অ্যাকসেস, টিম ইনভাইট, বা লিংক দিয়ে অ্যাক্টিভেশন সম্ভব নয়। এটি আপনার Gmail অ্যাকাউন্ট এর মাধমে সরাসরি ChatGPT আকাউন্ট অ্যাক্টিভেট করতে হয়। তাই অ্যাক্টিভেশনের সময় Gmail–এ লগইন প্রয়োজন হয়, আপনার দেওয়া অ্যাকাউন্টে প্রবেশ করা ছাড়া অ্যাক্টিভেশন সম্ভব নয়।
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <strong className="text-blue-400 block mb-2 font-semibold">👉 আপনার প্রাইভেসি সুরক্ষার জন্য :</strong>
                <p className="text-blue-100/90">
                  শুধু এই সাবস্ক্রিপশনের জন্য আলাদা নতুন Gmail খুলে দিন—এতে সম্পূর্ণ নিরাপদ লেনদেন সফল হবে । অ্যাক্টিভেশন শেষ হলে আপনি পাসওয়ার্ড পরিবর্তন করে নিবেন।
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5"
            >
              আমি বুঝতে পেরেছি, পরবর্তী ধাপ <ArrowRight size={18} />
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
            onSubmit={handleSubmit}
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-3 flex gap-2">
                    <AlertTriangle className="text-yellow-500 shrink-0" size={16} />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                      লগইন তথ্য শুধুমাত্র একবার অ্যাক্টিভেশনের জন্য ব্যবহৃত হবে।
                    </p>
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
                  অনুগ্রহ করে <span className="font-bold text-white">{getPaymentNumber()}</span> নম্বরে সেন্ড মানি করুন।
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
                onClick={() => setStep('notice')}
                className="flex-1 py-3 text-slate-400 hover:text-white font-medium transition-colors"
              >
                পেছনে যান
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
              >
                কনফার্ম করুন ৳{total.toLocaleString('bn-BD')}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              তথ্য যাচাই করা হচ্ছে
            </h3>
            <p className="text-slate-400">
              আপনার তথ্য নিরাপদে জমা দেওয়া হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              অর্ডারের সফল হয়েছে!
            </h3>
            <p className="text-slate-400 mb-6">
              শিগগিরই আপনার অ্যাকাউন্টে সাবস্ক্রিপশন চালু করে ইমেইল কনফার্মেশন
              পাঠানো হবে।
            </p>
            <p className="text-xs text-slate-600">উইন্ডোটি বন্ধ হচ্ছে...</p>
          </div>
        )}
      </div>
    </div>
  );
};