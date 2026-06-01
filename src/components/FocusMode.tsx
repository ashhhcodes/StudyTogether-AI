import { useState, useEffect } from 'react';
import { Eye, AlertTriangle, ShieldCheck } from 'lucide-react';

export function FocusMode() {
  const [focusScore,      setFocusScore]      = useState(100);
  const [isDistracted,    setIsDistracted]    = useState(false);
  const [distractionCount,setDistractionCount]= useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.2) {
        setIsDistracted(true);
        setFocusScore(p => Math.max(0, p - 5));
        setDistractionCount(p => p + 1);
        setTimeout(() => setIsDistracted(false), 2000);
      } else {
        setFocusScore(p => Math.min(100, p + 1));
      }
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const barColor = focusScore >= 80 ? '#80b890' : focusScore >= 50 ? '#b0a060' : '#b06060';

  return (
    <div className="absolute top-20 right-4 z-20">
      <div
        className="w-64 p-5"
        style={{
          background: 'rgba(4,4,14,0.90)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(192,192,220,0.16)',
          borderLeft: '2px solid rgba(160,160,210,0.40)',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.70)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 animate-pulse" style={{ color: '#7080a8' }} />
          <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#c8c8e0' }}>Super Focus HUD</p>
        </div>

        <div className="space-y-4">
          {/* Score bar */}
          <div>
            <div className="flex justify-between mb-1.5" style={{ fontSize: '0.72rem' }}>
              <span style={{ color: '#50506a' }}>Attention Rating</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: barColor }}>
                {focusScore}%
              </span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,192,220,0.06)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${focusScore}%`, background: barColor, boxShadow: `0 0 8px ${barColor}80` }}
              />
            </div>
          </div>

          {/* Distraction count */}
          <div className="flex justify-between items-center" style={{ fontSize: '0.72rem' }}>
            <span style={{ color: '#50506a' }}>Distractions</span>
            <span
              style={{
                color: '#c0c0d8', fontWeight: 700, fontFamily: 'var(--font-mono)',
                background: 'rgba(255,255,255,0.05)', padding: '1px 10px', borderRadius: '6px',
                border: '1px solid rgba(192,192,220,0.10)',
              }}
            >
              {distractionCount}
            </span>
          </div>

          {/* Alert */}
          {isDistracted && (
            <div
              className="flex items-center gap-2 p-2.5 rounded-xl animate-pulse"
              style={{ background: 'rgba(140,40,40,0.20)', border: '1px solid rgba(180,60,60,0.25)' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#b07070' }} />
              <p style={{ fontSize: '0.72rem', color: '#d0a0a0', fontWeight: 500 }}>Distraction detected!</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-2" style={{ borderTop: '1px solid rgba(192,192,220,0.07)', fontSize: '0.62rem', color: '#30304a' }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#505070' }} />
            <span>AI Attention Filter active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
