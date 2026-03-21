import { Trophy, Flame, Clock, Target, Award, TrendingUp } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';
import { BackgroundAnimations } from './BackgroundAnimations';

export function Dashboard() {
  // Primary metrics - most important
  const primaryStats = [
    { label: 'Total Study Time', value: '156h 24m', icon: <Clock className="w-8 h-8" />, color: 'indigo' },
    { label: "Today's Focus Time", value: '2h 15m', icon: <Target className="w-8 h-8" />, color: 'violet' },
  ];

  // Secondary metrics - supporting information
  const secondaryStats = [
    { label: 'Current Streak', value: '12 days', icon: <Flame className="w-5 h-5" />, color: 'orange' },
    { label: 'Tasks Completed', value: '47', icon: <Target className="w-5 h-5" />, color: 'green' },
    { label: 'Badges Earned', value: '8', icon: <Award className="w-5 h-5" />, color: 'purple' },
  ];

  const badges = [
    { name: 'Early Bird', description: 'Study before 7 AM', icon: '🌅', earned: true },
    { name: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', earned: true },
    { name: 'Marathon', description: 'Study 6+ hours', icon: '🏃', earned: true },
    { name: 'Week Warrior', description: '7-day streak', icon: '⚔️', earned: true },
    { name: 'Century', description: '100+ hours total', icon: '💯', earned: true },
    { name: 'Focus Master', description: '95%+ focus score', icon: '🎯', earned: false },
    { name: 'Social Scholar', description: '10+ study sessions with friends', icon: '👥', earned: false },
    { name: 'Book Worm', description: 'Read 50+ books', icon: '📚', earned: false },
  ];

  const recentSessions = [
    { date: 'Today', duration: '2h 15m', focus: 92, topic: 'Mathematics' },
    { date: 'Yesterday', duration: '3h 45m', focus: 88, topic: 'Physics' },
    { date: '2 days ago', duration: '1h 30m', focus: 95, topic: 'Chemistry' },
  ];

  return (
    <div className="relative min-h-screen">
      <BackgroundAnimations />
      
      <div className="relative z-10 p-8 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1>Welcome Back, Scholar!</h1>
          <p className="text-gray-600 mt-2">Keep up the great work. You&apos;re on fire! 🔥</p>
        </div>

        {/* Primary Stats - Emphasized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {primaryStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm mb-3">{stat.label}</p>
                  <p className="text-5xl tracking-tight mb-1">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats - De-emphasized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {secondaryStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-50 hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
              <p className="text-2xl ml-11">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Pomodoro Timer */}
          <div className="lg:col-span-2">
            <PomodoroTimer />
          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3>Weekly Progress</h3>
            </div>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const hours = [3, 4, 2, 5, 4, 3, 0][index];
                const percentage = (hours / 6) * 100;
                return (
                  <div key={day}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500">{day}</span>
                      <span className="text-gray-700">{hours}h</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Sessions - De-emphasized */}
        <div className="mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-50">
          <h3 className="mb-5">Recent Study Sessions</h3>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="mb-0.5">{session.topic}</p>
                  <p className="text-gray-500 text-sm">{session.date}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-gray-700">{session.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Focus</p>
                    <p className={session.focus >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                      {session.focus}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges Section - De-emphasized */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3>Achievements & Badges</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`p-4 rounded-xl border text-center transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-200/60 hover:border-amber-300'
                    : 'bg-gray-50/30 border-gray-200/50 opacity-40'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-sm mb-1">{badge.name}</p>
                <p className="text-xs text-gray-500">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}