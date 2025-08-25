import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';
import { BotIcon, SendIcon, UserIcon, XIcon } from './common/Icons';

const API_KEY = process.env.API_KEY;

interface Scheme {
  name: string;
  benefit: string;
  eligibility: string;
  applyProcess: string[];
  link?: {
    url: string;
    text: string;
  };
}

interface SchemeAIChatProps {
  schemes: Scheme[];
  onClose: () => void;
}

const SchemeAIChat: React.FC<SchemeAIChatProps> = ({ schemes, onClose }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!API_KEY) {
      setMessages([{ role: 'model', text: "Sorry, the AI Assistant is unavailable due to a configuration issue." }]);
      return;
    }

    const schemeData = schemes.map(s => `
      Scheme Name: ${s.name}
      Benefit: ${s.benefit}
      Eligibility: ${s.eligibility}
      Application Process: ${s.applyProcess.join(', ')}
      ${s.link ? `Official Link: ${s.link.url}` : ''}
    `).join('\n---\n');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are a "Scheme AI Assistant" for the Farm Connect app. Your primary role is to answer farmer's questions *only* about the government schemes provided below. Be helpful, clear, and concise. Do not answer questions unrelated to these schemes. If a user asks something else, politely guide them back to the topic of government schemes.

          Here is the list of available schemes:
          ---
          ${schemeData}
          ---
          Always base your answers on this information. When asked about a specific scheme, summarize its benefits, eligibility, and how to apply.`
        },
      });
      setChat(chatSession);
      setMessages([{ role: 'model', text: "Hello! Ask me any questions you have about the Government Schemes listed on this page." }]);
    } catch (e) {
      console.error("Failed to initialize Scheme AI Chat:", e);
      setMessages([{ role: 'model', text: "Sorry, I'm having trouble connecting to the AI service right now." }]);
    }
  }, [schemes]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage.text });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "I apologize, but I couldn't process that. Please try rephrasing your question." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-[60vh]">
        <header className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center">
            <BotIcon className="w-6 h-6 text-green-600" />
            <h3 className="ml-2 font-semibold text-gray-800">Scheme AI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close chat">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-600"/></div>}
                  <div className={`px-3 py-2 rounded-lg max-w-xs break-words text-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                   {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600"/></div>}
                </div>
              ))}
               {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-600"/></div>
                  <div className="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                     <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        
        <div className="p-3 border-t bg-white rounded-b-xl">
           <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a scheme..."
                className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 transition-colors"
                aria-label="Send message"
              >
                <SendIcon className="w-4 h-4"/>
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SchemeAIChat;
