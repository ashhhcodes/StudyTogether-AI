import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, CornerDownLeft, AlertCircle } from 'lucide-react';
import { askGemini } from "@/lib/gemini";

interface Message { sender: 'user' | 'ai'; text: string; time: string; }
interface AIAssistantProps { onClose: () => void; }

const chips = [
  'How should I structure a 2-hour study block?',
  'Give me a quick 5-min relaxation exercise.',
  'Explain the Pomodoro technique advantages.',
  'Suggest ambient music choices.',
];



export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am your AI Study Companion. How can I help you optimise your study session today?', time: '11:00 AM' },
  ]);
  const [input,    setInput]    = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);



const send = async (text?: string) => {
  const userPrompt = text ?? input;

  if (!userPrompt.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userPrompt,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  setInput("");
  setIsTyping(true);

  try {
    const aiReply = await askGemini(userPrompt);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: aiReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "AI failed to respond.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};





  return (

    
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}>
      <div className="absolute inset-0" onClick={onClose} />




      {/* Drawer */}
      <div
        className="w-full max-w-md h-screen flex flex-col relative z-10 animate-fade-in-left"
        style={{
          background: 'rgba(4,4,12,0.92)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(192,192,220,0.12)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.70)',
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between" style={{ borderBottom:'1px solid rgba(192,192,220,0.07)', background:'rgba(6,6,16,0.50)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl relative" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(192,192,220,0.10)' }}>
              <Bot className="w-5 h-5" style={{ color:'#8080a8' }} />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full" style={{ background:'#608060', border:'2px solid #04040c' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 style={{ fontSize:'0.88rem' }}>Study Companion</h3>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color:'#7070a0' }} />
              </div>
              <span style={{ fontSize:'0.6rem', color:'#38384a', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>AI Assistant</span>
            </div>
          </div>
<button
  onClick={onClose}
  className="text-gray-400 hover:text-white"
>
  ✕
</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={i} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                <div
                  className="max-w-[85%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed"
                  style={isAI
                    ? { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.09)', color:'#9090b0', borderTopLeftRadius:'4px' }
                    : { background:'linear-gradient(135deg,#1c1c2e 0%,#282840 100%)', border:'1px solid rgba(192,192,220,0.16)', color:'#d0d0f0', borderTopRightRadius:'4px' }}
                >
                  {msg.text.split('\n').map((line, li) => (
                    <p key={li} style={{ marginTop: li > 0 ? '6px' : 0 }}>{line}</p>
                  ))}
                </div>
                <span style={{ fontSize:'0.6rem', color:'#2a2a3a', marginTop:'4px', padding:'0 4px' }}>{msg.time}</span>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="px-3 py-2.5 rounded-2xl flex items-center gap-1.5"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.09)' }}>
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background:'rgba(160,160,200,0.60)', animationDelay:`${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion chips — only on first message */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p style={{ fontSize:'0.6rem', color:'#30304a', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:'8px' }}>
              Suggested Prompts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chips.map(c => (
                <button key={c} onClick={() => send(c)}
                  className="px-3 py-1.5 text-left rounded-lg transition-all"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.09)', color:'#505068', fontSize:'0.68rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color='#b0b0d0'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(192,192,220,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color='#505068'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(192,192,220,0.09)'; }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4" style={{ borderTop:'1px solid rgba(192,192,220,0.07)', background:'rgba(6,6,16,0.50)' }}>
          <div className="flex gap-2 relative items-center">
            <input
              type="text" placeholder="Ask anything about focus, schedules..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              className="w-full pl-3 pr-10 py-3 rounded-xl outline-none"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(192,192,220,0.10)', color:'#c0c0d8', fontSize:'0.78rem' }}
            />
            <button onClick={() => send()} disabled={!input.trim()}
              className="absolute right-1.5 p-2 rounded-lg transition-all"
              style={{ background: input.trim() ? 'rgba(160,160,200,0.16)' : 'rgba(255,255,255,0.03)', color: input.trim() ? '#a0a0c8' : '#303044' }}>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2" style={{ fontSize:'0.62rem', color:'#282838' }}>
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" style={{ color:'#404058' }} />
              Response generated locally
            </span>
            <span className="flex items-center gap-0.5">
              Press Enter <CornerDownLeft className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
