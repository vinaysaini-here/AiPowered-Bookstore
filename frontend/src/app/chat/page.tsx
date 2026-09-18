"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm your AI Book Assistant. How can I help you find your next great read today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", { query: userMessage });
      const answerContent = data?.data?.answer || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "ai", content: answerContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-theme('spacing.16'))] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 flex items-center gap-4 text-white shrink-0">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Book Assistant</h1>
            <p className="text-indigo-100 text-sm">Powered by Google Gemini</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.filter(msg => msg?.content).map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-indigo-100 text-indigo-600"}`}>
                {msg.role === "user" ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${msg.role === "user" ? "bg-slate-900 text-white rounded-tr-sm" : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm prose prose-sm prose-indigo"}`}>
                 <div dangerouslySetInnerHTML={{ __html: (msg?.content || "").replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex gap-4 flex-row">
               <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <Sparkles size={20} />
               </div>
               <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-2 text-slate-500">
                 <Loader2 className="animate-spin" size={16} /> Thinking...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to recommend a book..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 shrink-0"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
