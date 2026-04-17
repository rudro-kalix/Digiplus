import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { Lock, Loader2, Mail, Smartphone, AlertTriangle, ShieldAlert, ArrowRight, MessageCircle, Tag, Check, FileText } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay';
type CheckoutStep = 'notice' | 'details' | 'processing' | 'success';

// Coupon Definition
type CouponDef = {
  discount: number;
  allowedProductIds?: string[]; // If undefined, valid for all products
};

// Mock Coupons
// UPDATED: Now supports product-specific coupons
const VALID_COUPONS: Record<string, CouponDef> = {
  // Global Coupons (Valid for all)
  'DIGI20': { discount: 20 },
  
  // ChatGPT Plus Specific (ID: 'monthly-plus')
  'PLUS50': { discount: 50, allowedProductIds: ['monthly-plus'] },
  'CHAT30': { discount: 30, allowedProductIds: ['monthly-plus'] },

  // ChatGPT GO Specific (ID: 'yearly-go')
  'RET155': { discount: 155, allowedProductIds: ['yearly-go'] },
  'YEARLY50': { discount: 50, allowedProductIds: ['yearly-go'] }
};

// OPTIONAL: EmailJS Config
const EMAILJS_CONFIG = {
  SERVICE_ID: '', 
  TEMPLATE_ID: '', 
  PUBLIC_KEY: '',  
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [step, setStep] = useState<CheckoutStep>('notice');
  const [email, setEmail] = useState('');
  const [sessionData, setSessionData] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('notice');
      setEmail('');
      setSessionData('');
      setSenderNumber('');
      setTrxId('');
      setCouponCode('');
      setDiscount(0);
      setCouponMessage(null);
    }
  }, [isOpen]);

  const basePrice = product ? product.price : 0;
  const total = Math.max(0, basePrice - discount);
  const adminNumber = '8801607656890';

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    const code = couponCode.toUpperCase().trim();
    const coupon = VALID_COUPONS[code];
    
    if (coupon) {
      // Check if product restriction exists
      if (coupon.allowedProductIds && product) {
        if (!coupon.allowedProductIds.includes(product.id)) {
           setDiscount(0);
           setCouponMessage({ type: 'error', text: 'এই কুপনটি এই প্রোডাক্টের জন্য প্রযোজ্য নয়।' });
           return;
        }
      }

      setDiscount(coupon.discount);
      setCouponMessage({ type: 'success', text: `কুপন এপ্লাই করা হয়েছে! ৳${coupon.discount} ছাড়।` });
    } else {
      setDiscount(0);
      setCouponMessage({ type: 'error', text: 'ভুল কুপন কোড। ' });
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('processing');

    // 1. Save to Local History
    const newOrder: Order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        productName: product?.name || 'Unknown',
        price: total,
        status: 'Pending', // Default status
        trxId: trxId
    };

    const existingHistory = localStorage.getItem('digisub_orders');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    history.push(newOrder);
    localStorage.setItem('digisub_orders', JSON.stringify(history));


    // 2. Try to send via EmailJS (if configured)
    if (EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.PUBLIC_KEY) {
      try {
        const data = {
          service_id: EMAILJS_CONFIG.SERVICE_ID,
          template_id: EMAILJS_CONFIG.TEMPLATE_ID,
          user_id: EMAILJS_CONFIG.PUBLIC_KEY,
          template_params: {
            product: product?.name,
            price: total,
            email: email,
            sessionData: sessionData,
            method: method,
            sender: senderNumber,
            trx: trxId,
            coupon: couponCode || 'N/A'
          }
        };

        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error("EmailJS Failed:", error);
      }
    }

    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleCloseSuccess = () => {
    onSuccess();
    // Reset form
    setEmail('');
    setSessionData('');
    setSenderNumber('');
    setTrxId('');
    setStep('notice'); 
    onClose();
  };

  const generateWhatsAppLink = () => {
    const text = `
*নতুন অর্ডার* (DigiPlus)
------------------
📦 *Product:* ${product?.name}
💰 *Total:* ${total} BDT ${discount > 0 ? `(Discount: ${discount})` : ''}
------------------
📧 *Email:* ${email}
🔐 *Session:* ${sessionData}
------------------
💳 *Method:* ${method.toUpperCase()}
📱 *Sender:* ${senderNumber}
🆔 *TrxID:* ${trxId}
🎫 *Coupon:* ${couponCode || 'N/A'}
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
                <strong className="text-white block mb-2 font-semibold">সাবস্ক্রিপশন চালুর জন্য Session তথ্য প্রয়োজন</strong>
                আপনার নিজের Personal Account-এ সাবস্ক্রিপশন চালু করতে আমাদের আপনার সেশন তথ্য দরকার হবে।
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <strong className="text-red-400 block mb-2 font-semibold">⚠️ সতর্কতা:</strong>
                <ol className="text-red-100/90 text-xs list-decimal pl-4 space-y-1">
                  <li>যে অ্যাকাউন্টে সাবস্ক্রিপশন নিতে চান, সেই অ্যাকাউন্টে ব্রাউজার থেকে লগইন করুন।</li>
                  <li>লগইন অবস্থায় <span className="select-all">https://chatgpt.com/api/auth/session</span> ওপেন করুন।</li>
                  <li>স্ক্রিনে যা দেখাবে সব Select All করে কপি করে আমাদের WhatsApp-এ পাঠান।</li>
                </ol>
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
                <div className="text-2xl font-bold text-white flex gap-2 items-baseline">
                  {discount > 0 && (
                    <span className="text-lg text-slate-500 line-through decoration-red-500">৳{basePrice}</span>
                  )}
                  <span>৳{total.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                <p className="text-amber-300 text-sm font-semibold mb-2">Session নির্দেশনা:</p>
                <div className="text-amber-100/90 text-xs space-y-1 leading-relaxed">
                  <p>যে অ্যাকাউন্টে সাবস্ক্রিপশন নিতে চান, সেই অ্যাকাউন্টে ব্রাউজার থেকে লগইন করুন।</p>
                  <p>
                    লগইন অবস্থায়{' '}
                    <a
                      href="https://chatgpt.com/api/auth/session"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-amber-200 break-all"
                    >
                      https://chatgpt.com/api/auth/session
                    </a>{' '}
                    ওপেন করুন।
                  </p>
                  <p>স্ক্রিনে যা দেখাবে সব Select All করে কপি করে নিচে প্রদান করুন।</p>
                </div>
              </div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Session তথ্য (api/auth/session)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 text-slate-500" size={18} />
                    <textarea
                      required
                      rows={4}
                      value={sessionData}
                      onChange={(e) => setSessionData(e.target.value)}
                      placeholder="{"WARNING_BANNER:!!!!.............:{fetched":false}}} এরকম কপি করা পুরো তথ্য এখানে দিন"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 resize-none"
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
                  সেন্ড মানি করুন (৳{total}): <span className="font-bold text-white select-all">{getPaymentNumber()}</span>
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

              {/* Coupon Section - MOVED TO BOTTOM */}
              <div className="pt-4 border-t border-slate-800">
                 <label className="block text-slate-400 text-sm font-medium mb-2">
                    কুপন কোড (যদি থাকে)
                 </label>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder=""
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 uppercase"
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Apply
                    </button>
                 </div>
                 {couponMessage && (
                    <p className={`text-xs mt-2 flex items-center gap-1 ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {couponMessage.type === 'success' ? <Check size={12} /> : <AlertTriangle size={12} />}
                        {couponMessage.text}
                    </p>
                 )}
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
                অর্ডার নিশ্চিত করুন ৳{total.toLocaleString('bn-BD')}
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
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-yellow-500" />
            </div>
            {/* CHANGED HEADER HERE */}
            <h3 className="text-2xl font-bold text-white mb-2">
              গুরুত্বপূর্ণ শেষ ধাপ
            </h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mb-6 w-full">
              <p className="text-yellow-200 text-sm font-semibold mb-1">
                ⚠️ খুব গুরুত্বপূর্ণ:
              </p>
              <p className="text-slate-300 text-xs">
               অর্ডার কনফার্ম করতে নিচের বাটনে ক্লিক করে <strong>WhatsApp</strong>-এ পেমেন্ট ডিটেইলসের সাথে Session তথ্য পাঠিয়ে দিন। এটি পাঠালেই আপনার অর্ডার কনফার্ম হবে।
              </p>
            </div>
            
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCloseSuccess}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 mb-3"
            >
              <MessageCircle size={20} />
              অর্ডার ডিটেইলস পাঠান (WhatsApp)
            </a>
            
          
          </div>
        )}
      </div>
    </div>
  );
};
