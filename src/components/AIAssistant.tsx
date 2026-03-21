import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I&apos;m your AI study assistant. I can help you with quick questions, explain concepts, or provide study tips. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('calculus') || lowerQuestion.includes('derivative')) {
      return 'Great question about calculus! A derivative represents the rate of change of a function. Think of it as measuring how quickly something is changing at any given point. For example, if you have a position function, its derivative gives you velocity. Would you like me to explain a specific concept or help with a problem?';
    } else if (lowerQuestion.includes('physics') || lowerQuestion.includes('quantum')) {
      return 'Physics can be challenging but fascinating! Quantum mechanics deals with the behavior of matter and energy at the atomic and subatomic level. The key principle is that particles can exist in multiple states simultaneously until observed. What specific topic would you like to explore?';
    } else if (lowerQuestion.includes('study') || lowerQuestion.includes('tips') || lowerQuestion.includes('focus')) {
      return 'Here are some effective study tips:\n\n1. Use the Pomodoro Technique (25 min focus + 5 min break)\n2. Study in a distraction-free environment\n3. Take regular breaks to prevent burnout\n4. Use active recall instead of passive reading\n5. Teach concepts to others to reinforce learning\n\nWould you like more specific advice for your situation?';
    } else if (lowerQuestion.includes('motivation') || lowerQuestion.includes('tired')) {
      return 'It&apos;s completely normal to feel tired sometimes! Remember why you started and celebrate small wins. Try taking a short walk, having a healthy snack, or switching subjects to refresh your mind. You&apos;ve got this! 💪';
    } else {
      return 'That&apos;s an interesting question! While I can provide general guidance, for detailed help with specific problems, I recommend:\n\n1. Breaking down the problem into smaller parts\n2. Reviewing relevant examples from your textbook\n3. Discussing with your study group\n4. Using the Pomodoro timer to stay focused\n\nIs there a specific aspect you&apos;d like me to help clarify?';
    }
  };

  const quickQuestions = [
    'How do I stay focused while studying?',
    'Explain derivatives in calculus',
    'Tips for better time management',
    'How to use the Pomodoro technique?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <div>
            <h2 className="text-lg">AI Study Assistant</h2>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="w-full text-left px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          AI responses are for general guidance only
        </p>
      </div>
    </div>
  );
}
