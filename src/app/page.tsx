'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

type AIInput = {
    query: string;
};

type AIOutputput = {
    rows: string[];
};

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-b border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Database Assistant</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered data queries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                <span className="text-4xl">💬</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Welcome to Database Assistant</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">Ask questions about your data and get instant insights powered by AI</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg">🤖</span>
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-2xl ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className={`rounded-2xl px-5 py-3 shadow-sm ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                  : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700'
                              }`}
                            >
                              <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
                            </div>
                          );

                        case 'tool-db':
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="w-full my-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm"
                            >
                              <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300 mb-3">
                                <span className="text-lg">🔍</span>
                                <span>Database Query</span>
                              </div>

                              {(part.input as unknown as AIInput)?.query && (
                                <pre className="text-xs font-mono bg-white dark:bg-zinc-900 p-3 rounded-lg mb-3 overflow-x-auto border border-slate-200 dark:border-zinc-700 shadow-inner">
                                  {(part.input as unknown as AIInput).query}
                                </pre>
                              )}
                              {part.state === 'output-available' &&
                                (part.output as unknown as AIOutputput) && (
                                  <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>
                                      Returned{' '}
                                      {(part.output as unknown as AIOutputput).rows?.length || 0}{' '}
                                      rows
                                    </span>
                                  </div>
                                )}
                            </div>
                          );

                        case 'tool-schema':
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="w-full my-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm"
                            >
                              <div className="flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                <span className="text-lg">📋</span>
                                <span>Schema Tool</span>
                              </div>
                              {part.state === 'output-available' && (
                                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span>Schema loaded</span>
                                </div>
                              )}
                            </div>
                          );

                        case 'step-start':
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 my-3"
                            >
                              <span>Processing...</span>
                            </div>
                          );

                        case 'reasoning':
                          return null;

                        default:
                          return null;
                      }
                    })}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg">💁🏻</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-t border-slate-200 dark:border-zinc-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            className="relative"
          >
            <input
              className="w-full px-5 py-4 pr-14 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              value={input}
              placeholder="Ask a question about your data..."
              onChange={e => setInput(e.currentTarget.value)}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-zinc-700 dark:disabled:to-zinc-600 flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span className="text-lg">➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}