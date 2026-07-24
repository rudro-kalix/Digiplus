import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'ToolzAI BD-তে স্বাগতম! Google AI Pro Jio SIM অফার এখন মাত্র ৳৩৫০।',
      actionLabel: 'Telegram-এ ৳৩৫০ দিয়ে কিনুন',
      actionUrl: 'https://telegram.me/toolzai_bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    const normalizedMessage = userMessage.toLowerCase();
    const isJioOfferQuestion = [
      'google ai',
      'google pro',
      'jio',
      'জিও',
      '৩৫০',
      '350'
    ].some(keyword => normalizedMessage.includes(keyword));

    if (isJioOfferQuestion) {
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: 'Google AI Pro Jio SIM অফারটি ৳৩৫০। কিনতে নিচের বাটনে ক্লিক করে ToolzAI BD Telegram bot-এ যান।',
          actionLabel: 'Telegram-এ কিনুন',
          actionUrl: 'https://telegram.me/toolzai_bot'
        }
      ]);
      return;
    }

    if (!process.env.API_KEY) {
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: 'সাধারণ সাপোর্ট সাময়িকভাবে বন্ধ আছে। Google AI Pro Jio SIM অফারটি ৳৩৫০-এ কিনতে নিচের বাটনে ক্লিক করুন।',
          actionLabel: 'Telegram-এ কিনুন',
          actionUrl: 'https://telegram.me/toolzai_bot'
        }
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are a friendly and professional customer support agent for "ToolzAI BD", a digital store selling AI subscriptions in Bangladesh.
        
        IMPORTANT: Reply in Bengali (Bangla) only.

        Product Status:
        - ChatGPT Plus (12 months) price: 4600 BDT.
        - ChatGPT Go (12 months) price: 1195 BDT.
        - Google AI Pro Jio SIM offer price: 350 BDT. It must be purchased from https://telegram.me/toolzai_bot.
        - All products are currently available.

        Store Policies:
        - Delivery time: 10-30 minutes after payment.
        - Payment Methods: bKash, Nagad, Rocket, Upay.
        - Payment/Support Number: 01607656890 (Rocket: 01722195597)
        - Refund: Full refund if we cannot activate the subscription.
        
        Keep answers concise (under 50 words) and helpful. 
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
      });
      
      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;

      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।" }]);
      }
    } catch (error) {
      console.error("Bot error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "দুঃখিত, বর্তমানে সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px] transition-all duration-300 transform origin-bottom-right">
          <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              সাপোর্ট অ্যাসিস্ট্যান্ট
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="চ্যাট উইন্ডো বন্ধ করুন"
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-800/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.text}
                  {msg.actionUrl && (
                    <a
                      href={msg.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex w-full items-center justify-center rounded-lg bg-sky-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-sky-400"
                    >
                      {msg.actionLabel || 'Telegram-এ কিনুন'}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-xl p-3 rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                aria-label="মেসেজ পাঠান"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'সাপোর্ট চ্যাট বন্ধ করুন' : 'সাপোর্ট চ্যাট খুলুন'}
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  );
};
