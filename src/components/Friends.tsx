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
        return 'bg-green-500';
      case 'studying':
        return 'bg-purple-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.status === 'studying' && friend.currentActivity) {
      return `Studying ${friend.currentActivity}`;
    }
    return friend.status.charAt(0).toUpperCase() + friend.status.slice(1);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1>Friends</h1>
        <p className="text-gray-600 mt-2">Connect with fellow scholars and study together</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'friends'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Requests ({friendRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('find')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'find'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Find Friends
        </button>
      </div>

      {/* Friends List */}
      {activeTab === 'friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                      {friend.username.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-white rounded-full`} />
                  </div>
                  <div>
                    <p>{friend.username}</p>
                    <p className="text-sm text-gray-600">{getStatusText(friend)}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{friend.studyTime}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <span>🔥</span>
                  <span>{friend.streak} day streak</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={friend.status === 'offline'}
                >
                  <Video className="w-4 h-4" />
                  Study Together
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
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
            <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white">
                  {request.username.charAt(0)}
                </div>
                <div>
                  <p>{request.username}</p>
                  <p className="text-sm text-gray-600">
                    {request.mutualFriends > 0
                      ? `${request.mutualFriends} mutual friends`
                      : 'No mutual friends'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Accept
                </button>
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Find Friends */}
      {activeTab === 'find' && (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl mb-2">Find Study Partners</h2>
          <p className="text-gray-600 mb-6">
            Connect with other scholars by sharing your unique username or joining study rooms
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter username (e.g., Scholar#1234)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Send Friend Request
            </button>
          </div>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900">
              <strong>Your username:</strong> Scholar#4829
            </p>
            <p className="text-sm text-purple-700 mt-1">Share this with others to connect!</p>
          </div>
        </div>
      )}
    </div>
  );
}
