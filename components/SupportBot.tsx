import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

export const SupportBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I can help you with questions about our ChatGPT subscriptions. Ask away!' }
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
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        You are a friendly and professional customer support agent for "DigiSub", a digital store selling ChatGPT subscriptions.
        
        Products we sell:
        1. ChatGPT Plus (1 Month) - $25. Instant delivery via email.
        2. ChatGPT Go (1 Year) - $200. Long-term value, instant activation.

        Store Policies:
        - Delivery: Instant digital code sent to email after purchase.
        - Refund: 7-day money-back guarantee if the code is unused.
        - Support: 24/7 active support.
        
        Keep answers concise (under 50 words) and helpful. If asked about technical issues with OpenAI, direct them to OpenAI support.
        Focus on selling the convenience of buying from us.
      `;

      // Use a fresh chat history for context, mapped from our state
      // Note: In a real app, you'd maintain the history object properly.
      // Here we just send the current query with system instruction context for simplicity or maintain a session.
      // We will use generateContent for single turn or chats.create for multi-turn. 
      // Let's use chats.create for better conversation flow.

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction }
      });

      // Replay history to context (simplified for this demo)
      // In a robust app, we would pass the history to chats.create history param.
      // For this demo, we'll just send the message directly to a new chat instance 
      // or simplistic request since we don't persist the chat object across re-renders fully without a context provider.
      // To keep it simple and functional: We will just generate content for the specific question + context.
      
      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text;

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Bot error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
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
              Support AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
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
                placeholder="Ask about pricing..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
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
        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  );
};
