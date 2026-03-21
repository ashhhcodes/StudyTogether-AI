import { Home, Video, User, Users, BookOpen, CheckSquare } from 'lucide-react';
import type { View } from '../App';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { view: 'study-room', icon: <Video className="w-5 h-5" />, label: 'Study Rooms' },
    { view: 'friends', icon: <Users className="w-5 h-5" />, label: 'Friends' },
    { view: 'library', icon: <BookOpen className="w-5 h-5" />, label: 'E-Library' },
    { view: 'todos', icon: <CheckSquare className="w-5 h-5" />, label: 'To-Do List' },
    { view: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-purple-600">Study Together</h1>
        <p className="text-gray-500 text-sm mt-1">Your virtual study space</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => onViewChange(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
          <p className="text-sm">Today&apos;s Focus</p>
          <p className="text-2xl mt-1">4h 32m</p>
        </div>
      </div>
    </aside>
  );
}
