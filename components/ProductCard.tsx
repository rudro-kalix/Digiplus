import React from 'react';
import { Product } from '../types';
import { Check, ShoppingCart, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className={`relative bg-slate-800 rounded-2xl p-6 border ${product.popular ? 'border-blue-500 shadow-blue-500/10' : 'border-slate-700'} shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
      {product.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
          Best Value
        </div>
      )}
      
      <div className="mb-6 text-center">
        <div className="text-6xl mb-4">{product.image}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-slate-400 text-sm mb-4">{product.description}</p>
        <div className="flex justify-center items-baseline gap-1">
          <span className="text-4xl font-bold text-white">${product.price}</span>
          <span className="text-slate-500">/{product.duration}</span>
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
        onClick={() => onAddToCart(product)}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 
          ${product.popular 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20' 
            : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>
    </div>
  );
};
