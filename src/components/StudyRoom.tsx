import { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, Plus, Eye, AlertCircle, MonitorUp } from 'lucide-react';
import { FocusMode } from './FocusMode';

interface Room {
  id: string;
  name: string;
  participants: number;
  topic: string;
  isPrivate: boolean;
}

export function StudyRoom() {
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const rooms: Room[] = [
    { id: '1', name: 'Mathematics Study Group', participants: 5, topic: 'Calculus', isPrivate: false },
    { id: '2', name: 'Physics Deep Dive', participants: 3, topic: 'Quantum Mechanics', isPrivate: false },
    { id: '3', name: 'Late Night Grind', participants: 8, topic: 'Mixed', isPrivate: false },
    { id: '4', name: 'Finals Prep', participants: 12, topic: 'Various', isPrivate: false },
  ];

  const handleJoinRoom = (room: Room) => {
    setSelectedRoom(room);
    setInCall(true);
  };

  const handleLeaveRoom = () => {
    setInCall(false);
    setSelectedRoom(null);
    setFocusModeActive(false);
  };

  if (inCall && selectedRoom) {
    return (
      <div className="h-full bg-gray-900 text-white relative">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur rounded-lg px-4 py-2">
            <p className="text-sm text-gray-300">{selectedRoom.name}</p>
            <p className="text-xs text-gray-400 mt-1">
              {selectedRoom.participants} participants · {selectedRoom.topic}
            </p>
          </div>
        </div>

        {focusModeActive && <FocusMode />}

        <div className="h-full p-4 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          {/* Mock video feeds */}
          {[1, 2, 3, 4, 5].map((participant) => (
            <div
              key={participant}
              className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {videoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white/50" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <VideoOff className="w-8 h-8 text-gray-500" />
                    <p className="text-sm text-gray-500">Camera Off</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm">
                {participant === 1 ? 'You' : `Student ${participant}`}
              </div>
            </div>
          ))}
        </div>

        {/* Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-4 rounded-full transition-colors ${
                videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-4 rounded-full transition-colors ${
                audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {audioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setFocusModeActive(!focusModeActive)}
              className={`p-4 rounded-full transition-colors ${
                focusModeActive ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Toggle Super Focus Mode"
            >
              <Eye className="w-6 h-6" />
            </button>

            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <MonitorUp className="w-6 h-6" />
            </button>

            <button
              onClick={handleLeaveRoom}
              className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Study Rooms</h1>
        <p className="text-gray-600 mt-2">Join a room or create your own study session</p>
      </div>

      <div className="mb-6">
        <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-5 h-5" />
          Create New Room
        </button>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-purple-900">Super Focus Mode Available</p>
          <p className="text-purple-700 text-sm mt-1">
            Once in a study room, enable Super Focus Mode to track your attention using AI. You&apos;ll receive gentle reminders if the system detects distraction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg mb-1">{room.name}</h3>
                <p className="text-sm text-gray-600">{room.topic}</p>
              </div>
              {room.isPrivate && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Private</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">{room.participants} studying now</span>
            </div>

            <button
              onClick={() => handleJoinRoom(room)}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Join Room
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-xl mb-4">How Study Rooms Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <p className="mb-2">Video Calls</p>
            <p className="text-sm text-gray-600">Study together with friends or join public rooms to meet new study partners</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
              <Eye className="w-6 h-6 text-pink-600" />
            </div>
            <p className="mb-2">Focus Tracking</p>
            <p className="text-sm text-gray-600">Enable Super Focus Mode to get AI-powered attention monitoring and gentle reminders</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="mb-2">Study Together</p>
            <p className="text-sm text-gray-600">Stay motivated and accountable by studying with others in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
