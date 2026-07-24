import React, { useEffect, useState } from 'react';
import { X, History, ShoppingBag, Calendar, Trash2 } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      const storedOrders = localStorage.getItem('toolzai_orders') || localStorage.getItem('digisub_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders).reverse()); // Newest first
      }
    }
  }, [isOpen]);

  const clearHistory = () => {
    if(confirm('আপনি কি নিশ্চিত যে আপনি সম্পূর্ণ ইতিহাস মুছে ফেলতে চান?')) {
        localStorage.removeItem('toolzai_orders');
        localStorage.removeItem('digisub_orders');
        setOrders([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur sticky top-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="text-purple-500" />
            অর্ডার হিস্টোরি
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-3">
              <ShoppingBag size={40} className="opacity-30" />
              <p>কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি।</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-white text-md">{order.productName}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                            <Calendar size={12} />
                            {new Date(order.date).toLocaleDateString('bn-BD')} - {new Date(order.date).toLocaleTimeString('bn-BD')}
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        order.status === 'Completed' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                        {order.status === 'Completed' ? 'সফল' : 'প্রসেসিং'}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-700/50 mt-2">
                    <div className="text-xs text-slate-500">
                        TrxID: <span className="text-slate-300 font-mono">{order.trxId}</span>
                    </div>
                    <div className="font-bold text-white">
                        ৳{order.price.toLocaleString('bn-BD')}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button 
                    onClick={clearHistory}
                    className="w-full py-2 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-sm"
                >
                    <Trash2 size={16} />
                    হিস্টোরি মুছে ফেলুন
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
