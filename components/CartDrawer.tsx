import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemove,
  onCheckout 
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-slate-900 border-l border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="text-blue-500" />
              Your Cart
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Your cart is empty</p>
                <button onClick={onClose} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-slate-800 p-4 rounded-xl flex gap-4 border border-slate-700">
                  <div className="text-2xl bg-slate-900 w-12 h-12 flex items-center justify-center rounded-lg">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-slate-400 text-sm">${item.price} x {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
