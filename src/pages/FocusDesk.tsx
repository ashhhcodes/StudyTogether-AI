

import { supabase } from "@/lib/supabase";
import MainLayout from '@/layouts/MainLayout';
import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Settings, Music, CloudRain, Wind,
  Radio, Volume2, CheckSquare, Sparkles, Clipboard, Check,
  Camera, AlertTriangle,
} from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

// Silver-toned progress circle helper
const RADIUS = 90;
const CIRC   = 2 * Math.PI * RADIUS;

export function FocusDesk() {
  /* ── Pomodoro ── */
  const [mode, setMode]               = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [focusTime, setFocusTime]     = useState(25);
  const [breakTime, setBreakTime]     = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [isRunning, setIsRunning]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const getDuration = (m: typeof mode) =>
    m === 'focus' ? focusTime * 60 : m === 'break' ? breakTime * 60 : longBreakTime * 60;

  const [timeLeft, setTimeLeft] = useState(getDuration('focus'));
  useEffect(() => {
  const savedEndTime = localStorage.getItem("focusEndTime");

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
  "focusEndTime",
  endTime.toISOString()
);
    } else {
      localStorage.removeItem("focusEndTime");
    }
  }
}, []);
  const progress = timeLeft / getDuration(mode);
      
  useEffect(() => { setTimeLeft(getDuration(mode)); setIsRunning(false); }, [mode, focusTime, breakTime, longBreakTime]);
    

  useEffect(() => {
    let id: number | undefined;
    if (isRunning && timeLeft > 0) {
      id = window.setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
  setIsRunning(false);

  alert(`${mode === 'focus' ? 'Focus session' : 'Break'} completed!`);

  localStorage.removeItem("focusEndTime");
}
    return () => { if (id) clearInterval(id); };
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    try {
      const ctx  = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(660, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(); osc.stop(ctx.currentTime + 0.9);
    } catch { /* silent */ }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const strokeDashoffset = CIRC * (1 - progress);

  /* ── Ambient Audio ── */
  const [lofiVol,   setLofiVol]   = useState(0.2);
  const [rainVol,   setRainVol]   = useState(0);
  const [forestVol, setForestVol] = useState(0);
  const [noiseVol,  setNoiseVol]  = useState(0);

  const lofiRef   = useRef<HTMLAudioElement | null>(null);
  const rainRef   = useRef<HTMLAudioElement | null>(null);
  const forestRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef  = useRef<HTMLAudioElement | null>(null);

  const syncAudio = (ref: React.MutableRefObject<HTMLAudioElement | null>, vol: number) => {
    if (!ref.current) return;
    ref.current.volume = vol;
    if (vol > 0) ref.current.play().catch(() => {});
    else         ref.current.pause();
  };

  useEffect(() => syncAudio(lofiRef,   lofiVol),   [lofiVol]);
  useEffect(() => syncAudio(rainRef,   rainVol),   [rainVol]);
  useEffect(() => syncAudio(forestRef, forestVol), [forestVol]);
  useEffect(() => syncAudio(noiseRef,  noiseVol),  [noiseVol]);
  useEffect(() => () => {
    [lofiRef, rainRef, forestRef, noiseRef].forEach(r => r.current?.pause());
  }, []);

  /* ── Zen Notes ── */
  const [notes,  setNotes]  = useState(() => localStorage.getItem('zen-notes') || '');
  const [copied, setCopied] = useState(false);
  const saveNote = (v: string) => { setNotes(v); localStorage.setItem('zen-notes', v); };
  const copyNote = () => { navigator.clipboard.writeText(notes); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  /* ── Checklist ── */
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    setTodos(stored ? JSON.parse(stored) : [
      { id: '1', title: 'Complete Calculus Assignment Chapter 5', completed: false, priority: 'high',   category: 'Mathematics' },
      { id: '2', title: 'Read Physics Chapter 12-15',             completed: false, priority: 'medium', category: 'Physics'     },
      { id: '3', title: 'Review Chemistry Lab Notes',             completed: true,  priority: 'low',    category: 'Chemistry'   },
    ]);
  }, []);
  const toggleTodo = (id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated); localStorage.setItem('todos', JSON.stringify(updated));
  };

  /* ── Focus HUD ── */
  const [cameraActive, setCameraActive] = useState(false);
  const [focusScore,   setFocusScore]   = useState(100);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractions, setDistractions] = useState(0);
  
  useEffect(() => {
    if (!cameraActive) return;
    const id = setInterval(() => {
      if (Math.random() < 0.18) {
        setIsDistracted(true); setFocusScore(p => Math.max(20, p - 8)); setDistractions(p => p + 1);
        setTimeout(() => setIsDistracted(false), 2500);
      } else {
        setFocusScore(p => Math.min(100, p + 1));
      }
    }, 4500);
    return () => clearInterval(id);
  }, [cameraActive]);

  /* ── Shared style tokens ── */
  const panelStyle: React.CSSProperties = {
    background: 'rgba(8,8,18,0.55)',
    border: '1px solid rgba(192,192,220,0.13)',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
    backdropFilter: 'blur(18px)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.10em',
    textTransform: 'uppercase' as const, color: '#50506a',
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,192,220,0.12)',
    borderRadius: '0.6rem', color: '#d0d0e8', fontSize: '0.82rem', padding: '0.4rem 0.6rem',
    width: '100%', outline: 'none',
  };

  /* ── Ambient sound cards ── */
  const sounds = [
    { icon: <Music   className="w-4 h-4" />, label: 'Chill Lofi',   sub: 'Soft relaxing beats',       vol: lofiVol,   set: setLofiVol,   accent: '#8888b0', ref: lofiRef,   src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { icon: <CloudRain className="w-4 h-4" />, label: 'Steady Rain', sub: 'Cozy window raindrops',     vol: rainVol,   set: setRainVol,   accent: '#7090a8', ref: rainRef,   src: 'https://www.soundjay.com/nature/sounds/rain-07.mp3'           },
    { icon: <Wind    className="w-4 h-4" />, label: 'Forest Wind',   sub: 'Rustling leaves & breeze',  vol: forestVol, set: setForestVol, accent: '#708068', ref: forestRef, src: 'https://www.soundjay.com/nature/sounds/forest-wind-1.mp3'     },
    { icon: <Radio   className="w-4 h-4" />, label: 'White Noise',   sub: 'Constant blocking static',  vol: noiseVol,  set: setNoiseVol,  accent: '#888898', ref: noiseRef,  src: 'https://www.soundjay.com/misc/sounds/white-noise-01.mp3'      },
  ];

  const focusBarColor = focusScore >= 80 ? '#80b890' : focusScore >= 50 ? '#b0a060' : '#b06060';

  async function saveStudySession(duration: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const now = new Date();

  const { error } = await supabase
    .from("study_sessions")
    .insert([
      {
        user_id: user.id,
        subject: selectedSubject || "General",
        duration,
        completed: true,
        started_at: now,
        ended_at: now,
      },
    ]);

  if (error) {
    console.error(error);
  } else {
    console.log("Study session saved!");
  }
}

  return (

    <div className="p-8 max-w-[1400px] mx-auto space-y-8">

      {/* Audio elements */}
      {sounds.map(s => (
        <audio key={s.label} ref={s.ref} src={s.src} loop />
      ))}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5" style={{ color: '#7070a0' }} />
            <span style={labelStyle}>Workspace</span>
          </div>
          <h1>Focus Desk</h1>
          <p>Combine study tools, ambient loops, and notes into your flow.</p>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-full"
          style={{ background: 'rgba(10,10,22,0.60)', border: '1px solid rgba(192,192,220,0.14)' }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: isRunning ? 'radial-gradient(circle,#d8d8f8 0%,#9090b0 100%)' : '#303044',
              boxShadow: isRunning ? '0 0 10px rgba(200,200,240,0.7)' : 'none',
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8888a8', letterSpacing: '0.06em' }}>
            {isRunning ? 'Session Active' : 'Idle'}
          </span>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left — Pomodoro + HUD */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Pomodoro Timer */}
          <div className="p-8 flex flex-col items-center text-center relative overflow-hidden" style={panelStyle}>
            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="absolute top-4 right-4"
              style={{ color: '#44445a', padding: '0.4rem', borderRadius: '0.5rem' }}
              title="Timer Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Circular SVG timer */}
            <div className="relative w-64 h-64 flex items-center justify-center my-6">
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  background: 'rgba(4,4,12,0.92)',
                  border: '1px solid rgba(192,192,220,0.08)',
                  boxShadow: 'inset 0 4px 30px rgba(0,0,0,0.8)',
                }}
              />
              <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="128" cy="128" r={RADIUS}
                  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                <circle cx="128" cy="128" r={RADIUS}
                  fill="none"
                  stroke={isRunning ? '#9090c0' : '#505068'}
                  strokeWidth="7"
                  strokeDasharray={CIRC}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 1s linear',
                    filter: isRunning ? 'drop-shadow(0 0 7px rgba(160,160,210,0.6))' : 'none',
                  }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span
                  className="text-5xl font-extrabold tracking-wider"
                  style={{ color: '#e0e0f4', fontFamily: 'var(--font-mono)' }}
                >
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </span>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#50506a', marginTop: '4px', fontWeight: 600 }}>
                  {mode === 'focus' ? 'Focusing' : mode === 'break' ? 'Short Break' : 'Long Break'}
                </span>
              </div>
            </div>

            {/* Inline settings */}
            {showSettings && (
              <div
                className="w-full mb-5 p-4 text-left space-y-3"
                style={{ background: 'rgba(4,4,12,0.85)', border: '1px solid rgba(192,192,220,0.10)', borderRadius: '0.75rem' }}
              >
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8080a0' }}>Adjust Intervals (minutes)</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Focus',   val: focusTime,     set: setFocusTime     },
                    { label: 'Break',   val: breakTime,     set: setBreakTime     },
                    { label: 'L.Break', val: longBreakTime, set: setLongBreakTime },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>{f.label}</label>
                      <input
                        type="number" value={f.val}
                        onChange={e => f.set(Math.max(1, Number(e.target.value)))}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #1e1e30 0%, #2c2c44 100%)',
                  border: '1px solid rgba(192,192,220,0.22)',
                  color: '#d0d0f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
              </button>
              <button
                onClick={() => { setIsRunning(false); setTimeLeft(getDuration(mode)); }}
                className="px-5 py-3.5 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,192,220,0.10)', color: '#7070a0' }}
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Mode tabs */}
            <div
              className="flex p-1 rounded-xl w-full mt-5"
              style={{ background: 'rgba(4,4,12,0.60)', border: '1px solid rgba(192,192,220,0.08)' }}
            >
              {(['focus', 'break', 'longBreak'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={mode === m
                    ? { background: 'rgba(160,160,200,0.18)', color: '#d0d0f0', border: '1px solid rgba(192,192,220,0.20)' }
                    : { color: '#404055' }}
                >
                  {m === 'longBreak' ? 'Long Break' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Attention Tracker HUD */}
          <div
            className="p-6 relative overflow-hidden"
            style={{ ...panelStyle, borderLeft: '2px solid rgba(160,180,220,0.35)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" style={{ color: '#7090b0' }} />
                <h3 style={{ fontSize: '0.95rem' }}>Attention Tracker</h3>
              </div>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className="text-xs px-3 py-1.5 rounded-full font-bold transition-all"
                style={cameraActive
                  ? { background: 'rgba(180,60,60,0.15)', color: '#c07070', border: '1px solid rgba(180,60,60,0.25)' }
                  : { background: 'rgba(100,130,180,0.10)', color: '#8090b0', border: '1px solid rgba(100,130,180,0.18)' }}
              >
                {cameraActive ? 'Turn Off' : 'Turn On'}
              </button>
            </div>

            {cameraActive ? (
              <div className="space-y-4">
                {/* HUD screen */}
                <div
                  className="aspect-video rounded-xl relative overflow-hidden flex flex-col justify-between p-3"
                  style={{ background: 'rgba(2,2,10,0.90)', border: '1px solid rgba(140,160,210,0.18)', fontFamily: 'var(--font-mono)' }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="flex items-center gap-1.5" style={{ fontSize: '0.6rem', color: '#40405a' }}>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-ping" />
                      SECURE STREAM
                    </span>
                    <span
                      style={{ fontSize: '0.6rem', color: '#7080a0', fontWeight: 700, background: 'rgba(80,100,160,0.10)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(80,100,160,0.18)' }}
                    >
                      TRACKING EYE MOVEMENT
                    </span>
                  </div>

                  {/* Crosshair HUD */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="w-16 h-16 border border-dashed border-slate-400 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="absolute w-6 h-6 border-t border-l border-slate-400 -translate-x-3 -translate-y-3" />
                    <div className="absolute w-6 h-6 border-b border-r border-slate-400 translate-x-3 translate-y-3" />
                  </div>

                  {isDistracted && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center text-center animate-pulse"
                      style={{ background: 'rgba(120,30,30,0.35)', border: '1px solid rgba(180,60,60,0.28)', backdropFilter: 'blur(2px)' }}
                    >
                      <AlertTriangle className="w-8 h-8 mb-1" style={{ color: '#c07070' }} />
                      <p style={{ color: '#e0a0a0', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.10em' }}>DISTRACTION ALERT</p>
                      <p style={{ color: '#a06060', fontSize: '0.62rem' }}>Return eyes to screen</p>
                    </div>
                  )}

                  <div className="w-full flex justify-between items-baseline mt-auto" style={{ fontSize: '0.6rem', color: '#40405a' }}>
                    <span>FIDELITY: 98%</span>
                    <span style={{ color: '#6080a0' }}>FOCUS STATUS: STABLE</span>
                  </div>
                </div>

                {/* Score bar */}
                <div>
                  <div className="flex justify-between mb-1.5" style={{ fontSize: '0.72rem' }}>
                    <span style={{ color: '#50506a' }}>Session Focus Score</span>
                    <span style={{ fontWeight: 700, color: focusBarColor }}>{focusScore}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(192,192,220,0.06)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${focusScore}%`, background: focusBarColor, boxShadow: `0 0 8px ${focusBarColor}80` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between" style={{ fontSize: '0.65rem', color: '#40405a' }}>
                  <span>Distractions logged: <strong style={{ color: '#8080a0' }}>{distractions}</strong></span>
                  <span>Beep trigger: enabled</span>
                </div>
              </div>
            ) : (
              <div
                className="p-8 text-center rounded-xl"
                style={{ background: 'rgba(4,4,12,0.50)', border: '1px solid rgba(192,192,220,0.07)' }}
              >
                <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: '#303044', opacity: 0.6 }} />
                <p style={{ fontSize: '0.8rem', color: '#44445a' }}>Start super attention monitoring</p>
                <p style={{ fontSize: '0.7rem', color: '#303040', marginTop: '4px' }}>
                  Uses camera feed to calculate visual attention and alert on distraction.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Sounds + Notes + Checklist */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Ambient Sound Mixer */}
          <div className="p-6" style={panelStyle}>
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5" style={{ color: '#7070a0' }} />
              <h3>Ambient Background Sounds</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sounds.map(s => (
                <div
                  key={s.label}
                  className="p-4 flex flex-col justify-between"
                  style={{ background: 'rgba(4,4,12,0.55)', border: '1px solid rgba(192,192,220,0.08)', borderRadius: '0.75rem' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)', color: s.accent }}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c0c0d8' }}>{s.label}</p>
                        <p style={{ fontSize: '0.65rem', color: '#44445a' }}>{s.sub}</p>
                      </div>
                    </div>
                    {/* Waveform indicator */}
                    {s.vol > 0 && (
                      <div className="flex gap-0.5 items-end h-4">
                        {[0.1, 0.3, 0.5].map((d, i) => (
                          <span key={i} className="w-0.5 lofi-bar rounded-full"
                            style={{ height: `${8 + i * 4}px`, background: s.accent, animationDelay: `${d}s`, opacity: 0.8 }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05" value={s.vol}
                    onChange={e => s.set(Number(e.target.value))}
                    className="w-full cursor-pointer h-1 rounded-lg"
                    style={{ accentColor: s.accent }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Zen Notes + Checklist side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Zen Notes */}
            <div className="p-5 flex flex-col" style={{ ...panelStyle, height: '340px' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontSize: '0.9rem' }}>Zen Notes</h3>
                <button
                  onClick={copyNote}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: copied ? '#80b890' : '#44445a' }}
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={e => saveNote(e.target.value)}
                placeholder="Jot thoughts during your focus block..."
                className="flex-1 w-full resize-none outline-none rounded-xl p-3"
                style={{
                  background: 'rgba(4,4,12,0.40)',
                  border: '1px solid rgba(192,192,220,0.08)',
                  color: '#b0b0c8',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.65,
                }}
              />
            </div>

            {/* Desk Checklist */}
            <div className="p-5 flex flex-col" style={{ ...panelStyle, height: '340px' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-4 h-4" style={{ color: '#6060a0' }} />
                <h3 style={{ fontSize: '0.9rem' }}>Desk Checklist</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {todos.filter(t => !t.completed).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Check className="w-8 h-8 mb-1" style={{ color: '#60906a' }} />
                    <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8080a0' }}>All tasks done!</p>
                    <p style={{ fontSize: '0.65rem', color: '#404055', marginTop: '2px' }}>Add more in the To-Do List tab</p>
                  </div>
                ) : (
                  todos.filter(t => !t.completed).map(todo => (
                    <div
                      key={todo.id}
                      onClick={() => toggleTodo(todo.id)}
                      className="p-3 flex items-start gap-3 cursor-pointer group rounded-xl transition-all"
                      style={{ background: 'rgba(4,4,12,0.40)', border: '1px solid rgba(192,192,220,0.07)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(192,192,220,0.18)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(192,192,220,0.07)'}
                    >
                      <div
                        className="w-4 h-4 mt-0.5 rounded flex-shrink-0 flex items-center justify-center"
                        style={{ border: '1px solid rgba(192,192,220,0.20)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '0.78rem', color: '#b0b0c8', fontWeight: 500 }} className="truncate">
                          {todo.title}
                        </p>
                        <span style={{ fontSize: '0.62rem', color: '#44445a', marginTop: '2px', display: 'inline-block',
                          background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '4px' }}>
                          {todo.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}
