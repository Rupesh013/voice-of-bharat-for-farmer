
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';
import { UserIcon, BotIcon, SendIcon, AlertTriangleIcon } from './common/Icons';

const API_KEY = process.env.API_KEY;

const ExpertGuidance: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!API_KEY) {
      setError("API Key is not configured. The chat feature is unavailable.");
      return;
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are "Farm Connect AI," a friendly and knowledgeable agricultural expert. Your goal is to help farmers by providing clear, concise, and actionable advice in multiple languages, including Indian languages. You can answer questions about:
            - Crop information (sowing, harvesting, best practices)
            - Pest and disease diagnosis and treatment
            - Government schemes for farmers
            - Weather patterns and advice
            - Market prices and trends
            When a user asks a question, provide the best possible answer based on your knowledge. Keep the tone supportive and easy to understand.`
          },
        });
        setChat(chatSession);

        setMessages([
            { role: 'model', text: 'Hello! I am your AI Farming Assistant. How can I help you today? You can ask me about crops, diseases, government schemes, and more.' }
        ]);
    } catch (e) {
        console.error("Failed to initialize AI Chat:", e);
        setError("Failed to initialize the AI chat service.");
    }

  }, []);

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
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userMessage.text });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error while processing your request. Please check your connection and try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Expert Guidance AI</h1>
            <div className="mt-8 max-w-3xl mx-auto p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
                <AlertTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0"/>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Feature Unavailable</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Expert Guidance AI</h1>
      <p className="mt-2 text-gray-600">Ask anything about farming, and our AI assistant will help you.</p>

      <div className="mt-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[70vh]">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-600"/></div>}
                  <div className={`px-4 py-3 rounded-2xl max-w-lg break-words ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                   {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600"/></div>}
                </div>
              ))}
               {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><BotIcon className="w-5 h-5 text-green-600"/></div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
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
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertGuidance;
