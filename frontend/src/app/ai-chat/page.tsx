'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Sparkles, User, Bot } from 'lucide-react';
import { getAIChatResponse, fetchTasks } from '../../lib/api';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category_name: string;
  priority_score: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

export default function ModernAIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    loadTasks();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponseData = await getAIChatResponse(input, tasks, messages);
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseData.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    } catch (error) {
      console.error('Error getting AI chat response:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: 'ai', text: '⚠️ Could not get a response from AI.' },
      ]);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-transparent text-gray-900 dark:text-gray-100">
      {/* Chat Messages */}
      <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-32">
        {messages.length === 0 && !loading ? (
          /* Empty State - Centered Welcome */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
              Welcome to Smart Assistant
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
              I can help you manage your tasks, answer questions, and provide insights. What would you like to know?
            </p>
            
            {/* Suggested Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
              <button 
                onClick={() => setInput("Show me my highest priority tasks")}
                className="p-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">Priority Tasks</div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-xs">Show high priority items</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setInput("What's my schedule for today?")}
                className="p-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">Today's Schedule</div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-xs">View daily agenda</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setInput("Help me organize my tasks")}
                className="p-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">Organize Tasks</div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-xs">Get organization tips</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => setInput("What can you help me with?")}
                className="p-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <Send className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">Capabilities</div>
                    <div className="text-neutral-600 dark:text-neutral-400 text-xs">Learn what I can do</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white ml-auto shadow-sm'
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-sm border border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="flex items-end gap-3 p-3 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <Input
                className="flex-1 shadow-none border-0 bg-transparent dark:bg-transparent placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-800 dark:text-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                placeholder="Ask anything about your tasks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !loading) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || input.trim() === ''} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Suggested prompts - only show when there are messages */}
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                <button 
                  onClick={() => setInput("Show me my highest priority tasks")}
                  className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-400 rounded-full transition-colors"
                >
                  Show priority tasks
                </button>
                <button 
                  onClick={() => setInput("What's my schedule for today?")}
                  className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-400 rounded-full transition-colors"
                >
                  Today's schedule
                </button>
                <button 
                  onClick={() => setInput("Help me organize my tasks")}
                  className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-400 rounded-full transition-colors"
                >
                  Organize tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}