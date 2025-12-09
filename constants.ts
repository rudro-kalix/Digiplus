import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'monthly-plus',
    name: 'চ্যাটজিপিটি প্লাস',
    description: 'স্বল্পমেয়াদী প্রজেক্ট এবং ব্যক্তিগত ব্যবহারের জন্য সেরা।',
    price: 195, // Adjusted for local context BDT
    duration: '১ মাস',
    image: '⚡',
    features: [
      'সম্পূর্ণ ব্যক্তিগত অ্যাকাউন্ট (Personal)',
      '✅দ্রুত রেসপন্স টাইম',
      '✅নতুন ফিচারে অগ্রাধিকার',
      '✅ Faster Response Speed',
      '✅ Priority Access (Rush Hour-এও দ্রুত চলবে)',
      '✅ Access to Advanced Models (GPT-4o / GPT-5.1)',
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
    description: 'দীর্ঘমেয়াদী ব্যবহারের জন্য সাশ্রয়ী সেরা প্যাকেজ।',
    price: 295, // Adjusted for local context BDT
    duration: '১ বছর',
    image: '🚀',
    popular: true,
    features: [
      '১০০% ব্যক্তিগত অ্যাকাউন্ট (Personal)',
      '৮২০০ টাকা সাশ্রয়',
      '✅ আর অনেক বেশী File Upload',
      '✅ Fast Images Generation',
      '✅ Unlimited Prompt',
      '✅ Full Access GPT-5.1',
      '✅ Voice Mode ',
      '✅ ইনস্ট্যান্ট এক্টিভেশন'

    ]
  }
];