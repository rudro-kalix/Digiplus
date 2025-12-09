import React, { useState } from 'react';
import { PRODUCTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportBot } from './components/SupportBot';
import { CartItem, Product } from './types';
import { ShoppingBag, Star, Zap, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-xl font-bold text-white tracking-tight">DigiSub</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
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
              Trusted by 10,000+ users
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Upgrade Your <span className="gradient-text">AI Experience</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              Get instant access to ChatGPT Plus and premium AI tools. 
              Secure payment, instant delivery, and 24/7 dedicated support.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm mb-20">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500" size={18} /> Instant Delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-green-500" size={18} /> Secure Payment
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {PRODUCTS.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Features/Trust Section */}
        <div className="bg-slate-900 border-t border-slate-800 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white mb-12">Why Buy From Us?</h2>
             <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                   <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400">
                     <Zap />
                   </div>
                   <h3 className="text-white font-semibold mb-2">Instant Delivery</h3>
                   <p className="text-slate-400 text-sm">Receive your login credentials via email within seconds of payment confirmation.</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                   <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-green-400">
                     <ShieldCheck />
                   </div>
                   <h3 className="text-white font-semibold mb-2">Guaranteed Warranty</h3>
                   <p className="text-slate-400 text-sm">Full warranty coverage for the duration of your subscription. We replace if anything goes wrong.</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                   <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4 text-purple-400">
                     <Star />
                   </div>
                   <h3 className="text-white font-semibold mb-2">Premium Support</h3>
                   <p className="text-slate-400 text-sm">Our AI-powered support team is available 24/7 to answer any questions you might have.</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p className="mb-4">&copy; 2024 DigiSub. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSuccess={handleCheckoutSuccess}
      />

      <SupportBot />
    </div>
  );
};

export default App;
