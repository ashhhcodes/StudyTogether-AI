import { useState, useEffect } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

export function FocusMode() {
  const [focusScore, setFocusScore] = useState(100);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);

  useEffect(() => {
    // Simulate focus tracking (in production, this would use OpenCV/ML)
    const interval = setInterval(() => {
      const random = Math.random();
      
      // 20% chance of detecting "distraction"
      if (random < 0.2) {
        setIsDistracted(true);
        setFocusScore((prev) => Math.max(0, prev - 5));
        setDistractionCount((prev) => prev + 1);
        
        // Play beep sound (mock)
        playBeep();
        
        // Reset after 2 seconds
        setTimeout(() => setIsDistracted(false), 2000);
      } else if (focusScore < 100) {
        // Gradually recover focus score
        setFocusScore((prev) => Math.min(100, prev + 1));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [focusScore]);

  const playBeep = () => {
    // In production, this would play an actual beep sound
    console.log('🔔 Beep! Stay focused!');
  };

  return (
    <div className="absolute top-20 right-4 z-20">
      <div className="bg-black/80 backdrop-blur rounded-lg p-4 w-64">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-purple-400" />
          <p className="text-white">Super Focus Mode</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Focus Score</span>
              <span className={`${focusScore >= 80 ? 'text-green-400' : focusScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {focusScore}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  focusScore >= 80 ? 'bg-green-500' : focusScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${focusScore}%` }}
              />
            </div>
          </div>

          <div className="text-sm">
            <span className="text-gray-300">Distractions: </span>
            <span className="text-white">{distractionCount}</span>
          </div>

          {isDistracted && (
            <div className="bg-red-500/20 border border-red-500 rounded p-2 flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-red-300 text-sm">Stay focused!</p>
            </div>
          )}

          <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
            AI is monitoring your attention through camera feed
          </div>
        </div>
      </div>
    </div>
  );
}
