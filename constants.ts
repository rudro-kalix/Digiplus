import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'monthly-plus',
    name: 'চ্যাটজিপিটি প্লাস',
    description: '১২ মাসের পার্সোনাল সাবস্ক্রিপশন, দীর্ঘমেয়াদী ব্যবহারের জন্য প্রিমিয়াম প্যাক।',
    price: 4600,
    duration: 'মেয়াদ ১২ মাস',
    image: '⚡',
    available: true,
    features: [
      '🛡️ আপনার নিজের Personal Account এ দেওয়া হবে',
      '⚡ এটি এককালীন পেমেন্ট, প্রতি মাসে রিনিউ করার ঝামেলা নেই',
      '✅ ফুল ওয়ারেন্টি সহ',
      '❌ এটি টিম ইনভাইটেশন বা workspace একাউন্ট নয়',
      '✅ মেয়াদ শেষে হিস্টোরি থাকবে'
    ]
  },
  {
    id: 'yearly-go',
    name: 'ChatGPT GO',
    description: '১২ মাসের বাজেট-ফ্রেন্ডলি পার্সোনাল সাবস্ক্রিপশন।',
    price: 1020,
    duration: 'মেয়াদ ১২ মাস',
    image: '🚀',
    popular: true,
    available: true,
    features: [
      '🛡️ আপনার নিজের Personal Account এ দেওয়া হবে',
      '⚡ এটি এককালীন পেমেন্ট, প্রতি মাসে রিনিউ করার ঝামেলা নেই',
      '✅ ফুল ওয়ারেন্টি সহ',
      '❌ এটি টিম ইনভাইটেশন বা workspace একাউন্ট নয়',
      '✅ মেয়াদ শেষে হিস্টোরি থাকবে'
    ]
  }
];
