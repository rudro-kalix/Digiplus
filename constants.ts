import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'monthly-plus',
    name: 'ChatGPT Plus',
    description: 'Perfect for short-term projects and trying out advanced features.',
    price: 25.00,
    duration: '1 Month',
    image: '⚡',
    features: [
      'Access to GPT-4',
      'Faster response times',
      'Exclusive access to beta features',
      'Priority server access',
      'Instant Email Delivery'
    ]
  },
  {
    id: 'yearly-go',
    name: 'ChatGPT Go',
    description: 'The ultimate power-user package for serious productivity.',
    price: 200.00,
    duration: '1 Year',
    image: '🚀',
    popular: true,
    features: [
      'Everything in Plus',
      'Save $100 annually',
      '1 Year valid warranty',
      'Dedicated support line',
      'Bulk query processing',
      'Instant Email Delivery'
    ]
  }
];
