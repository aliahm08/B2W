import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am the Borek-G advertising assistant. How can I help optimize your campaigns today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const responses = [
                "Based on the latest data, I recommend reallocating 15% of your Instagram budget to Facebook Local Awareness ads for the weekend rush.",
                "Your current Cost Per Click (CPC) for the savory pastries campaign is $0.45, which is 12% lower than the generic benchmark. Keep it running!",
                "I've drafted 3 new ad copy variations highlighting the new spinach and feta borek. Would you like to review them?",
                "To improve local foot traffic, try running a time-sensitive promotional ad between 7 AM and 10 AM targeting commuters within a 3-mile radius.",
                "That's a great question. Looking at your historical data, video ads showcasing the baking process have a 2x higher engagement rate than static images."
            ];

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responses[Math.floor(Math.random() * responses.length)]
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full w-full bg-neutral-50 rounded-sm overflow-hidden border border-neutral-200">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                            ? 'bg-black text-white rounded-tr-sm'
                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-sm'
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 flex-row"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-neutral-200 text-black">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                            <Loader2 size={14} className="animate-spin text-neutral-400" />
                            <span className="text-xs text-neutral-400">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-neutral-200">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for advertising advice..."
                        className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        <Send size={16} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
