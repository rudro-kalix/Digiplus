import React from 'react';
import { Product } from '../types';
import { Check, Zap, User, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  const isYearly = product.duration.includes('বছর') || product.id.includes('year');

  return (
    <div className={`relative bg-slate-800 rounded-2xl p-6 border ${product.popular ? 'border-blue-500 shadow-blue-500/10' : 'border-slate-700'} shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
      {product.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
          সেরা অফার
        </div>
      )}
      
      <div className="mb-6 text-center">
        <div className="text-6xl mb-4">{product.image}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
        
        {/* Highlight Duration Badge */}
        <div className="flex justify-center mb-3">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border shadow-lg ${
                isYearly
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-300 shadow-amber-900/20' 
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-900/20'
            }`}>
                <Clock size={16} />
                <span className="font-bold text-lg">{product.duration}</span>
            </div>
        </div>

        <p className="text-slate-400 text-sm mb-4">{product.description}</p>
        
        {/* Highlight Personal Account */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <User size={12} />
            ব্যক্তিগত অ্যাকাউন্ট
        </div>

        <div className="flex justify-center items-baseline gap-1">
          <span className="text-4xl font-bold text-white">৳{product.price.toLocaleString('bn-BD')}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {product.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onBuyNow(product)}
        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Zap size={18} />
        Buy Now
      </button>
    </div>
  );
};