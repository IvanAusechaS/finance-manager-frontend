import { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { API_BASE_URL } from "../lib/env";

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistoryMessage {
  userQuestion: string;
  geminiAnswer: string;
  createdAt: string;
}

export function ChatAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const history: ChatHistoryMessage[] = await response.json();
        const formattedMessages: ChatMessage[] = history.flatMap((msg, idx) => [
          {
            id: idx * 2,
            role: 'user' as const,
            content: msg.userQuestion,
            timestamp: new Date(msg.createdAt),
          },
          {
            id: idx * 2 + 1,
            role: 'assistant' as const,
            content: msg.geminiAnswer,
            timestamp: new Date(msg.createdAt),
          },
        ]);
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer || data.geminiAnswer || 'Lo siento, no pude procesar tu pregunta.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Chat con IA Financiera</h1>
            </div>
            <p className="text-gray-600">
              Pregunta sobre tus finanzas, obtén consejos y analiza tus transacciones con ayuda de IA
            </p>
          </div>

          {/* Chat Container */}
          <Card className="h-[calc(100vh-280px)] flex flex-col">
            <CardHeader>
              <CardTitle className="text-slate-900">Conversación</CardTitle>
              <CardDescription>
                Puedes hacer preguntas sobre tus finanzas, solicitar consejos o análisis de tus gastos
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingHistory ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                      <p className="text-gray-500">Cargando historial...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        ¡Bienvenido al Chat de IA!
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Estoy aquí para ayudarte con tus finanzas. Puedes preguntarme sobre:
                      </p>
                      <ul className="mt-4 text-left inline-block text-sm text-gray-600 space-y-1">
                        <li>• Análisis de tus gastos e ingresos</li>
                        <li>• Consejos de ahorro personalizados</li>
                        <li>• Sugerencias de presupuesto</li>
                        <li>• Tendencias en tus transacciones</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-indigo-600" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {loading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="bg-slate-100 rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe tu pregunta sobre finanzas..."
                    disabled={loading}
                    rows={1}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:bg-gray-50 disabled:text-gray-500"
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Presiona Enter para enviar, Shift + Enter para nueva línea
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
