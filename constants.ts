import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'monthly-plus',
    name: 'চ্যাটজিপিটি প্লাস',
    description: '১২ মাসের পার্সোনাল সাবস্ক্রিপশন, দীর্ঘমেয়াদী ব্যবহারের জন্য প্রিমিয়াম কর্পোরেট প্যাক।',
    price: 4600,
    duration: 'মেয়াদ ১২ মাস',
    image: '⚡',
    available: true,
    features: [
      '🛡️ সম্পূর্ণ ব্যক্তিগত অ্যাকাউন্ট (Personal)',
      '❌ এটি টিম ইনভাইটেশন বা workspace একাউন্ট নয়',
      '✅ মেয়াদ শেষে হিস্টোরি থাকবে',
      '⚡এটি এককালীন পেমেন্ট, প্রতি মাসে রিনিউ করার ঝামেলা নেই',
      '✅ ফুল ওয়ারেন্টি সহ',
      '✅দ্রুত রেসপন্স টাইম',
      '✅নতুন ফিচারে অগ্রাধিকার',
      '✅ Faster Response Speed',
      '✅ Priority Access (Rush Hour-এও দ্রুত চলবে)',
      '✅ Access to Advanced Models (GPT-5.3 / GPT-5.4)',
      '✅ Codex Agent Access',
      '✅ Improved Image Generation',
      '✅ Higher Message Limits',
      '✅ More File Upload Capacity',
      '✅ ইনস্ট্যান্ট এক্টিভেশন'
    ]
  },
  {
    id: 'yearly-go',
    name: 'ChatGPT GO',
    description: '১২ মাসের বাজেট-ফ্রেন্ডলি স্টুডেন্ট পার্সোনাল সাবস্ক্রিপশন।',
    price: 1195,
    duration: 'মেয়াদ ১২ মাস',
    image: '🚀',
    popular: true,
    available: true,
    features: [
      '🛡️ আপনার নিজের Personal Account এ দেওয়া হবে',
      '⚡ এটি এককালীন পেমেন্ট, প্রতি মাসে রিনিউ করার ঝামেলা নেই',
      '✅ ফুল ওয়ারেন্টি সহ',
      '❌ এটি টিম ইনভাইটেশন বা workspace একাউন্ট নয়',
      '✅ মেয়াদ শেষে হিস্টোরি থাকবে',
      '✅ আর অনেক বেশী File Upload',
      '✅ Fast Images Generation',
      '✅ Unlimited Prompt',
      '✅ Full Access GPT-5.3',
      '✅ Voice Mode ',
      '✅ ইনস্ট্যান্ট এক্টিভেশন'
    ]
  }
];
