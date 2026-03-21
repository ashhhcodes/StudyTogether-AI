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
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <User className="w-12 h-12" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-3 py-2 mb-2 text-white"
                />
              ) : (
                <h1 className="text-3xl mb-2">{displayName}</h1>
              )}
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white w-full"
                  rows={2}
                />
              ) : (
                <p className="text-white/90">{bio}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p>Anonymous Mode</p>
              <p className="text-sm text-gray-600">
                Hide your identity and use a randomly generated username
              </p>
            </div>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnonymous ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnonymous ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p>Show Study Stats</p>
              <p className="text-sm text-gray-600">Let others see your study time and progress</p>
            </div>
            <button className="relative w-14 h-7 rounded-full bg-purple-600">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p>Public Profile</p>
              <p className="text-sm text-gray-600">Allow others to view your profile and badges</p>
            </div>
            <button className="relative w-14 h-7 rounded-full bg-purple-600">
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full translate-x-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-4xl">{achievement.icon}</div>
              <div>
                <p>{achievement.name}</p>
                <p className="text-sm text-gray-600">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Preferences */}
      <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
        <h2 className="text-xl mb-4">Study Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Favorite Study Topics</label>
            <div className="flex flex-wrap gap-2">
              {['Mathematics', 'Physics', 'Computer Science', 'Chemistry'].map((topic) => (
                <span key={topic} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {topic}
                </span>
              ))}
              <button className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-purple-400 hover:text-purple-600">
                + Add Topic
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Preferred Study Time</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
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
