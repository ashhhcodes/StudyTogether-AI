import MainLayout from '@/layouts/MainLayout';
import { Trophy, Flame, Clock, Target, Award, TrendingUp, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Dashboard() {
  const [totalHours, setTotalHours] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [consistencyData, setConsistencyData] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  const primaryStats = [
    { label: 'Total Study Time',   value: `${totalHours} mins`,      icon: <Clock className="w-6 h-6" />,      iconColor: '#8888a0', desc: 'Across 4 subjects'      },
    { label: "Today's Focus Time", value: `${todayHours} mins`,      icon: <Target className="w-6 h-6" />,     iconColor: '#a0c0a0', desc: 'Daily Goal: 4 hours'    },
    { label: 'Current Streak',     value: `${streak} day streak`, icon: <Flame className="w-6 h-6" />,      iconColor: '#c0a080', desc: 'Top 5% of students'    },
    { label: 'Focus Score Avg',    value: `${focusScore}%`,          icon: <TrendingUp className="w-6 h-6" />, iconColor: '#80a0c0', desc: '+3% from last week'    },
  ];

  const studyData = [
  { day: "Sun", hours: weeklyData[0] },
  { day: "Mon", hours: weeklyData[1] },
  { day: "Tue", hours: weeklyData[2] },
  { day: "Wed", hours: weeklyData[3] },
  { day: "Thu", hours: weeklyData[4] },
  { day: "Fri", hours: weeklyData[5] },
  { day: "Sat", hours: weeklyData[6] },
  ];

  const badges = [
    { name: 'Early Bird',    description: 'Study before 7 AM',         icon: '🌅', earned: true  },
    { name: 'Night Owl',     description: 'Study after 10 PM',         icon: '🦉', earned: true  },
    { name: 'Marathoner',    description: 'Study 6+ hours',            icon: '🏃', earned: true  },
    { name: 'Week Warrior',  description: '7-day streak',              icon: '⚔️', earned: true  },
    { name: 'Century Club',  description: '100+ hours total',          icon: '💯', earned: true  },
    { name: 'Focus Master',  description: '95%+ focus score',          icon: '🎯', earned: false },
    { name: 'Social Scholar',description: '10+ sessions with friends', icon: '👥', earned: false },
    { name: 'Book Worm',     description: 'Read 50+ books',            icon: '📚', earned: false },
  ];

  // Heatmap intensity levels → galaxy-black to platinum glow
  const heatmapStyles = [
    { bg: 'rgb(174, 225, 178)',   border: 'rgba(255,255,255,0.05)', shadow: 'none' },
    { bg: 'rgba(134, 227, 151, 0.73)',  border: 'rgba(200,200,220,0.10)', shadow: 'none' },
    { bg: 'rgba(97, 223, 120, 0.88)', border: 'rgba(200,200,220,0.18)', shadow: 'none' },
    { bg: 'rgba(67, 196, 76, 0.82)',border:'rgba(200,200,230,0.28)', shadow: '0 0 6px rgba(200,200,240,0.20)' },
    { bg: 'rgba(47, 240, 8, 0.92)',border:'rgba(220,220,245,0.50)', shadow: '0 0 10px rgba(200,200,240,0.40)' },
  ];


const calendarWeeks = [];

for (let w = 0; w < 18; w++) {
  const week = [];

  for (let d = 0; d < 7; d++) {
    const index = w * 7 + d;

    const count = consistencyData[index] || 0;

    let level = 0;

    if (count >= 1) level = 1;
    if (count >= 3) level = 2;
    if (count >= 5) level = 3;
    if (count >= 7) level = 4;

    week.push({
      id: `w${w}-d${d}`,
      level,
    });
  }

  calendarWeeks.push(week);
}




  useEffect(() => {
  fetchDashboardStats();
}, []);


  async function fetchDashboardStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return;
  }

  const sessions = data || [];
  
  const heatmap: Record<string, number> = {};

sessions.forEach((session) => {
  const date = new Date(
    session.created_at
  ).toDateString();

  heatmap[date] = (heatmap[date] || 0) + 1;
});

const last30Days: number[] = [];

for (let i = 29; i >= 0; i--) {
  const d = new Date();

  d.setDate(d.getDate() - i);

  const key = d.toDateString();

  last30Days.push(heatmap[key] || 0);
}

setConsistencyData(last30Days);

    const uniqueDays = [
    ...new Set(
      sessions.map((session) =>
        new Date(session.created_at).toDateString()
      )
    ),
  ];

  uniqueDays.sort(
    (a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;

  for (let i = 0; i < uniqueDays.length; i++) {
    const currentDay = new Date(uniqueDays[i]);
    const previousDay = new Date();

    previousDay.setDate(previousDay.getDate() - i);

    if (
      currentDay.toDateString() ===
      previousDay.toDateString()
    ) {
      currentStreak++;
    } else {
      break;
    }
  }

  setStreak(currentStreak);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];

  sessions.forEach((session) => {
    const day = new Date(session.created_at).getDay();

    weeklyMinutes[day] += session.duration || 0;
  });

  setWeeklyData(weeklyMinutes);

  // Total minutes
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );

  // Today's minutes
  const today = new Date().toDateString();

  const todayMinutes = sessions
    .filter(
      (session) =>
        new Date(session.created_at).toDateString() === today
    )
    .reduce(
      (sum, session) => sum + (session.duration || 0),
      0
    );

  setTotalHours(totalMinutes);
  setTodayHours(todayMinutes);
  setSessionCount(sessions.length);
  const calculatedScore = Math.min(
  100,
  60 + sessions.length * 5
);

setFocusScore(calculatedScore);
}
  return (
    
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">

      {/* ── Welcome Banner ── */}
      <div
        className="relative rounded-2xl p-8 overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,22,0.80) 0%, rgba(14,14,28,0.70) 100%)',
          border: '1px solid rgba(192,192,220,0.14)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Subtle silver nebula glow */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle, rgba(200,200,230,0.06) 0%, transparent 70%)', opacity: 0.6 }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5" style={{ color: '#9090b0' }} />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: '#606080' }}>
                Welcome Back
              </span>
            </div>
            <h1>Hey there, Scholar!</h1>
            <p className="mt-2 max-w-xl">
              You are crushing your study goals this week. Your average focus score is up, and your streak is safe! Keep it going! 🔥
            </p>
          </div>

          <div
            className="flex items-center gap-4 px-6 py-4 rounded-xl"
            style={{ background: 'rgba(8,8,18,0.70)', border: '1px solid rgba(192,192,220,0.12)' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: '#80b890' }} />
            <div>
              <p style={{ fontSize: '0.7rem', color: '#55556a' }}>Daily Target Progress</p>
              <p className="text-lg font-bold mt-0.5" style={{ color: '#d8d8f0' }}>2h 15m / 4h 00m</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat) => (
          <div
            key={stat.label}
            className="glass-panel glass-panel-hover p-6 flex flex-col justify-between h-40 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p style={{ fontSize: '0.65rem', color: '#55556a', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold tracking-tight mt-1" style={{ color: '#e0e0f4' }}>
                  {stat.value}
                </p>
              </div>
              <div
                className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,200,220,0.10)', color: stat.iconColor }}
              >
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#50506a', marginTop: '1rem' }}>{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Analytics Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Weekly Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Study Trends</h3>
              <p style={{ fontSize: '0.72rem', color: '#50506a' }}>Weekly breakdown of hours spent focusing</p>
            </div>
            <div
              className="flex p-0.5 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(8,8,18,0.6)', border: '1px solid rgba(192,192,220,0.10)' }}
            >
              <button
                className="px-3 py-1.5 rounded-md"
                style={{ background: 'rgba(180,180,210,0.14)', color: '#d0d0f0' }}
              >
                This Week
              </button>
              <button className="px-3 py-1.5" style={{ color: '#44445a' }}>Last Week</button>
            </div>
          </div>

          <div className="h-64 w-full" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c0c0d8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c0c0d8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#363650" tickLine={false} axisLine={false} tick={{ fill: '#505068' }} />
                <YAxis stroke="#363650" tickLine={false} axisLine={false} tick={{ fill: '#505068' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(6,6,16,0.95)',
                    border: '1px solid rgba(192,192,220,0.18)',
                    borderRadius: '8px',
                    color: '#e0e0f0',
                  }}
                  itemStyle={{ color: '#b0b0d0' }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#9090b8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#studyGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3>Study Consistency</h3>
            <p style={{ fontSize: '0.72rem', color: '#50506a' }}>Track focus sessions over 18 weeks</p>
          </div>

          <div className="my-6">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {calendarWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1 flex-shrink-0">
                  {week.map((day) => {
                    const s = heatmapStyles[day.level];
                    return (
                      <div
                        key={day.id}
                        className="w-3.5 h-3.5 rounded"
                        title={`Intensity: ${day.level}`}
                        style={{ background: s.bg, border: `1px solid ${s.border}`, boxShadow: s.shadow }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2" style={{ fontSize: '0.62rem', color: '#44445a', fontWeight: 600 }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <div className="flex items-center gap-1 ml-auto">
                <span>Less</span>
                {[0,2,4].map(l => (
                  <div key={l} className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: heatmapStyles[l].bg, border: `1px solid ${heatmapStyles[l].border}` }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>

          <div
            className="p-3 rounded-xl flex items-start gap-2"
            style={{ background: 'rgba(8,8,18,0.50)', border: '1px solid rgba(192,192,220,0.10)', fontSize: '0.72rem', color: '#55556a' }}
          >
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#7070a0' }} />
            <p>
              Your most active study time is <strong style={{ color: '#c0c0d8' }}>9 PM – 11 PM</strong>. Consistent late-night sessions earned you the <strong style={{ color: '#9898b8' }}>Night Owl</strong> badge!
            </p>
          </div>
        </div>
      </div>

      {/* ── Badges Panel ── */}
      <div className="glass-panel p-6 star-glow-silver">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: '#9090a8' }} />
            <h3>Achievements &amp; Badges</h3>
          </div>
          <button className="text-xs font-semibold flex items-center gap-0.5" style={{ color: '#7070a0' }}>
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 relative group overflow-hidden"
              style={{
                background: badge.earned ? 'rgba(10,10,22,0.50)' : 'rgba(6,6,14,0.30)',
                border: `1px solid ${badge.earned ? 'rgba(192,192,220,0.16)' : 'rgba(255,255,255,0.05)'}`,
                opacity: badge.earned ? 1 : 0.35,
                filter: badge.earned ? 'none' : 'grayscale(1)',
              }}
              onMouseEnter={e => {
                if (badge.earned) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(220,220,245,0.28)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 16px rgba(200,200,230,0.10)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = badge.earned ? 'rgba(192,192,220,0.16)' : 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{badge.icon}</div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#c8c8e0' }} className="truncate w-full">{badge.name}</p>
              <p style={{ fontSize: '0.62rem', color: '#44445a', marginTop: '2px' }} className="truncate w-full">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  
  );
}