export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  image: string; // URL or emoji placeholder
  popular?: boolean;
  available?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  email: string;
  paymentMethod: 'card' | 'crypto';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Order {
  id: string;
  date: string;
  productName: string;
  price: number;
  status: 'Pending' | 'Completed';
  trxId: string;
}