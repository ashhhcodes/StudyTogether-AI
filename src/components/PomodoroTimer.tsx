import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export function PomodoroTimer() {
  const [mode, setMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play notification sound (mock)
      alert(`${mode === 'focus' ? 'Focus session' : 'Break'} completed!`);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleReset = () => {
    setIsRunning(false);
    const times = { focus: focusTime, break: breakTime, longBreak: longBreakTime };
    setTimeLeft(times[mode] * 60);
  };

  const switchMode = (newMode: 'focus' | 'break' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    const times = { focus: focusTime, break: breakTime, longBreak: longBreakTime };
    setTimeLeft(times[newMode] * 60);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Pomodoro Timer</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm">Focus Duration (min)</label>
              <input
                type="number"
                value={focusTime}
                onChange={(e) => setFocusTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              />
            </div>
            <div>
              <label className="text-sm">Break Duration (min)</label>
              <input
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              />
            </div>
            <div>
              <label className="text-sm">Long Break Duration (min)</label>
              <input
                type="number"
                value={longBreakTime}
                onChange={(e) => setLongBreakTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/20 rounded border border-white/30 text-white"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'focus' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'break' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'longBreak' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="text-8xl mb-4 tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-white/80 text-lg">
          {mode === 'focus' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
