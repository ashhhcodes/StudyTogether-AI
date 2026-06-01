import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { UserPlus, Video, MessageCircle, MoreVertical, Search, Clock } from 'lucide-react';

interface Friend {
  id: string;
  username: string;
  status: 'online' | 'studying' | 'offline';
  currentActivity?: string;
  studyTime: string;
  streak: number;
}

export function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');

  const friends: Friend[] = [
    { id: '1', username: 'Scholar#2847', status: 'studying', currentActivity: 'Mathematics', studyTime: '45h', streak: 8 },
    { id: '2', username: 'Bookworm#9182', status: 'online', studyTime: '62h', streak: 15 },
    { id: '3', username: 'NightOwl#4721', status: 'studying', currentActivity: 'Physics', studyTime: '38h', streak: 5 },
    { id: '4', username: 'StudyBuddy#1593', status: 'offline', studyTime: '28h', streak: 3 },
    { id: '5', username: 'FocusedMind#7642', status: 'studying', currentActivity: 'Chemistry', studyTime: '91h', streak: 22 },
  ];

  const friendRequests = [
    { id: '1', username: 'NewScholar#8264', mutualFriends: 2 },
    { id: '2', username: 'LearnFast#3847', mutualFriends: 0 },
  ];

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'studying':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-[#5a5a68]';
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === 'studying' && friend.currentActivity) {
      return `Studying ${friend.currentActivity}`;
    }
    return friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
  };

  const tabClass = (tab: typeof activeTab) =>
    activeTab === tab
      ? 'border-[#c8c8d8] text-[#f0f0f8]'
      : 'border-transparent text-muted-foreground hover:text-[#c8c8dc]';

  return (
    
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1>Friends</h1>
          <p className="text-muted-foreground mt-2">Connect with fellow scholars and study together</p>
        </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-12"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 border-b-2 transition-colors ${tabClass('friends')}`}
        >
          All Friends ({friends.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 border-b-2 transition-colors ${tabClass('requests')}`}
        >
          Requests ({friendRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('find')}
          className={`px-4 py-2 border-b-2 transition-colors ${tabClass('find')}`}
        >
          Find Friends
        </button>
      </div>

      {/* Friends List */}
      {activeTab === 'friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="glass-panel rounded-xl p-6 hover:border-white/20 transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold border border-white/15"
                      style={{
                        background: 'linear-gradient(135deg, #3a3a44 0%, #1e1e24 100%)',
                      }}
                    >
                      {friend.username.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-[#0a0a10] rounded-full`} />
                  </div>
                  <div>
                    <p className="text-[#e8e8f2]">{friend.username}</p>
                    <p className="text-sm text-muted-foreground">{getStatusText(friend)}</p>
                  </div>
                </div>
                <button type="button" className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{friend.studyTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>🔥</span>
                  <span>{friend.streak} day streak</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-[#0a0a0e] font-semibold disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
                  disabled={friend.status === 'offline'}
                >
                  <Video className="w-4 h-4" />
                  Study Together
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-white/15 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#b0b0c0]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friend Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {friendRequests.map((request) => (
            <div
              key={request.id}
              className="glass-panel rounded-xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold border border-white/15"
                  style={{ background: 'linear-gradient(135deg, #404048 0%, #222228 100%)' }}
                >
                  {request.username.charAt(0)}
                </div>
                <div>
                  <p className="text-[#e8e8f2]">{request.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.mutualFriends > 0
                      ? `${request.mutualFriends} mutual friends`
                      : 'No mutual friends'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="px-6 py-2 btn-primary">
                  Accept
                </button>
                <button type="button" className="px-6 py-2 btn-secondary">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Find Friends */}
      {activeTab === 'find' && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-white/[0.08] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/12">
            <UserPlus className="w-8 h-8 text-[#c0c0d0]" />
          </div>
          <h2 className="text-xl mb-2">Find Study Partners</h2>
          <p className="text-muted-foreground mb-6">
            Connect with other scholars by sharing your unique username or joining study rooms
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter username (e.g., Scholar#1234)"
              className="glass-input mb-3"
            />
            <button type="button" className="w-full py-3 btn-primary">
              Send Friend Request
            </button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white/[0.05] border border-white/10">
            <p className="text-sm text-[#d8d8e8]">
              <strong>Your username:</strong> Scholar#4829
            </p>
            <p className="text-sm text-muted-foreground mt-1">Share this with others to connect!</p>
          </div>
        </div>
      )}
    </div>
    
  );
}
