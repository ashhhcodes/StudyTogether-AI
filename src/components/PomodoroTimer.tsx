import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export function PomodoroTimer() {
  const [mode, setMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  useEffect(() => {
  const savedEndTime = localStorage.getItem("pomodoroEndTime");

  if (savedEndTime) {
    const remaining =
      Math.floor(
        (new Date(savedEndTime).getTime() - Date.now()) / 1000
      );

    if (remaining > 0) {
      setTimeLeft(remaining);
      setIsRunning(true);
      const endTime = new Date(
  Date.now() + timeLeft * 1000
    );

localStorage.setItem(
  "pomodoroEndTime",
  endTime.toISOString()
);
    } else {
      localStorage.removeItem("pomodoroEndTime");
    }
  }
}, []);
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

  alert(`${mode === 'focus' ? 'Focus session' : 'Break'} completed!`);

  localStorage.removeItem("pomodoroEndTime");
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
    <div
      className="rounded-xl p-8 text-white shadow-lg border border-white/10 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(145deg, rgba(18,18,26,0.95) 0%, rgba(8,8,14,0.98) 50%, rgba(6,6,10,1) 100%)',
        boxShadow: '0 0 40px -12px rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Pomodoro Timer</h2>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="bg-white/8 backdrop-blur rounded-lg p-4 mb-6 border border-white/10">
          <div className="space-y-3">
            <div>
              <label className="text-sm">Focus Duration (min)</label>
              <input
                type="number"
                value={focusTime}
                onChange={(e) => setFocusTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/10 rounded border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="text-sm">Break Duration (min)</label>
              <input
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/10 rounded border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="text-sm">Long Break Duration (min)</label>
              <input
                type="number"
                value={longBreakTime}
                onChange={(e) => setLongBreakTime(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-white/10 rounded border border-white/15 text-white"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 rounded-lg transition-all border border-transparent ${
            mode === 'focus' ? 'bg-white text-[#14141a] border-white/20' : 'bg-white/12 hover:bg-white/16'
          }`}
        >
          Focus
        </button>
        <button
          type="button"
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg transition-all border border-transparent ${
            mode === 'break' ? 'bg-white text-[#14141a] border-white/20' : 'bg-white/12 hover:bg-white/16'
          }`}
        >
          Break
        </button>
        <button
          type="button"
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 rounded-lg transition-all border border-transparent ${
            mode === 'longBreak' ? 'bg-white text-[#14141a] border-white/20' : 'bg-white/12 hover:bg-white/16'
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
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 px-8 py-4 bg-white text-[#14141a] rounded-xl hover:bg-[#e8e8ee] transition-colors font-semibold"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-8 py-4 bg-white/12 hover:bg-white/18 rounded-xl transition-colors border border-white/12"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
