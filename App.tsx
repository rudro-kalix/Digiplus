import React, { useState } from 'react';
import { PRODUCTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportBot } from './components/SupportBot';
import { AboutModal } from './components/AboutModal';
import { Product } from './types';
import { Star, Zap, ShieldCheck, Info } from 'lucide-react';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setSelectedProduct(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-[inherit]">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Image - Replace src with your own logo URL */}
            <img 
              src="https://placehold.co/100x100/3b82f6/ffffff?text=Logo" 
              alt="DigiPlus Logo" 
              className="w-10 h-10 rounded-lg shadow-lg shadow-blue-500/20 object-cover"
            />
            <span className="text-xl font-bold text-white tracking-tight">DigiPlus</span>
          </div>

          {/* Navbar Links */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Info size={18} className="relative group-hover:text-blue-400 transition-colors" />
              <span className="relative font-medium text-sm">আমার সম্পর্কে</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-sm font-medium mb-8">
              <Star size={14} className="fill-current" />
              ১০,০০০+ গ্রাহকের আস্থা
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              আপনার Ai অভিজ্ঞতা <br/><span className="gradient-text">আপগ্রেড করুন</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              চ্যাটজিপিটি প্লাস এবং প্রিমিয়াম Ai টুলস কিনুন খুব সহজে। 
              বিকাশ, নগদ, রকেট পেমেন্ট, ইনস্ট্যান্ট ডেলিভারি এবং ২৪/৭ সাপোর্ট।
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm mb-20">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500" size={18} /> ইনস্ট্যান্ট ডেলিভারি
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} /> নিরাপদ পেমেন্ট
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRODUCTS.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onBuyNow={handleBuyNow} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Features/Trust Section */}
        <div className="bg-slate-900 border-t border-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white mb-12">কেন আমাদের থেকে কিনবেন?</h2>
             <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                   <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400">
                     <Zap />
                   </div>
                   <h3 className="text-white font-semibold mb-2">দ্রুত ডেলিভারি</h3>
                   <p className="text-slate-400 text-sm">পেমেন্ট কনফার্ম করার কয়েক সেকেন্ডের মধ্যেই ইমেইলে আপনার লগইন তথ্য পেয়ে যাবেন।</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                   <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-400">
                     <ShieldCheck />
                   </div>
                   <h3 className="text-white font-semibold mb-2">গ্যারান্টিযুক্ত ওয়ারেন্টি</h3>
                   <p className="text-slate-400 text-sm">সাবস্ক্রিপশনের মেয়াদকালীন সম্পূর্ণ ওয়ারেন্টি। কোনো সমস্যা হলে সাথে সাথে রিপ্লেসমেন্ট।</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                   <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-400">
                     <Star />
                   </div>
                   <h3 className="text-white font-semibold mb-2">প্রিমিয়াম সাপোর্ট</h3>
                   <p className="text-slate-400 text-sm">আমাদের এআই সাপোর্ট টিম ২৪/৭ প্রস্তুত আপনার যেকোনো প্রশ্নের উত্তর দিতে।</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p className="mb-4">&copy; ২০২৫ DigiPlus। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</a>
            <a href="#" className="hover:text-white transition-colors">টার্মস অফ সার্ভিস</a>
            <a 
              href="https://wa.me/8801607656890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors font-medium flex items-center gap-1"
            >
              সাপোর্ট (WhatsApp)
            </a>
          </div>
        </div>
      </footer>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        product={selectedProduct}
        onSuccess={handleCheckoutSuccess}
      />

      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <SupportBot />
    </div>
  );
};

export default App;