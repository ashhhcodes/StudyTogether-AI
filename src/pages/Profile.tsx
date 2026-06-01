import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { User, Edit2, Shield, Trophy, Clock, Target } from 'lucide-react';

export function Profile() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [displayName, setDisplayName] = useState('Scholar#4829');
  const [bio, setBio] = useState('Passionate about learning and growing every day');
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: 'Total Hours', value: '156h', icon: <Clock className="w-5 h-5" /> },
    { label: 'Streak', value: '12 days', icon: <Target className="w-5 h-5" /> },
    { label: 'Badges', value: '8', icon: <Trophy className="w-5 h-5" /> },
  ];

  const achievements = [
    { name: 'Early Bird', date: 'Earned 3 days ago', icon: '🌅' },
    { name: 'Week Warrior', date: 'Earned 1 week ago', icon: '⚔️' },
    { name: 'Century Club', date: 'Earned 2 weeks ago', icon: '💯' },
    { name: 'Night Owl', date: 'Earned 3 weeks ago', icon: '🦉' },
  ];

  return (
    
    <div className="p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div
        className="rounded-xl p-8 text-white mb-8 relative overflow-hidden border border-white/10"
        style={{
          background:
            'linear-gradient(145deg, rgba(18,18,26,0.95) 0%, rgba(8,8,14,0.98) 45%, rgba(6,6,10,1) 100%)',
          boxShadow: '0 0 40px -12px rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/10">
              <User className="w-12 h-12" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 mb-2 text-white"
                />
              ) : (
                <h1 className="text-3xl mb-2">{displayName}</h1>
              )}
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white w-full"
                  rows={2}
                />
              ) : (
                <p className="text-white/90">{bio}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/8 backdrop-blur rounded-lg p-4 text-center border border-white/8">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="glass-panel rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-[#a8a8b8]" />
          <h2 className="text-xl">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-lg border border-white/8">
            <div>
              <p className="text-[#e8e8f2]">Anonymous Mode</p>
              <p className="text-sm text-muted-foreground">
                Hide your identity and use a randomly generated username
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnonymous ? 'bg-[#5a5a68]' : 'bg-white/15'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnonymous ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-lg border border-white/8">
            <div>
              <p className="text-[#e8e8f2]">Show Study Stats</p>
              <p className="text-sm text-muted-foreground">Let others see your study time and progress</p>
            </div>
            <button type="button" className="relative w-14 h-7 rounded-full bg-[#5a5a68]">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/[0.04] rounded-lg border border-white/8">
            <div>
              <p className="text-[#e8e8f2]">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow others to view your profile and badges</p>
            </div>
            <button type="button" className="relative w-14 h-7 rounded-full bg-[#5a5a68]">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-xl mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg border border-amber-900/30 bg-gradient-to-r from-amber-950/25 to-orange-950/20"
            >
              <div className="text-4xl">{achievement.icon}</div>
              <div>
                <p className="text-[#e8e8f2]">{achievement.name}</p>
                <p className="text-sm text-muted-foreground">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Preferences */}
      <div className="glass-panel rounded-xl p-6 mt-8">
        <h2 className="text-xl mb-4">Study Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Favorite Study Topics</label>
            <div className="flex flex-wrap gap-2">
              {['Mathematics', 'Physics', 'Computer Science', 'Chemistry'].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-white/[0.08] text-[#d4d4e4] rounded-full text-sm border border-white/12"
                >
                  {topic}
                </span>
              ))}
              <button
                type="button"
                className="px-3 py-1 border-2 border-dashed border-white/20 text-[#9090a0] rounded-full text-sm hover:border-white/35 hover:text-[#c8c8dc] transition-colors"
              >
                + Add Topic
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Preferred Study Time</label>
            <select className="glass-input">
              <option>Morning (6 AM - 12 PM)</option>
              <option>Afternoon (12 PM - 6 PM)</option>
              <option>Evening (6 PM - 10 PM)</option>
              <option>Night (10 PM - 2 AM)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
  );
}
