import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { StudyRoom } from './components/StudyRoom';
import { Profile } from './components/Profile';
import { Friends } from './components/Friends';
import { Library } from './components/Library';
import { TodoList } from './components/TodoList';
import { AIAssistant } from './components/AIAssistant';
import { Sidebar } from './components/Sidebar';

export type View = 'dashboard' | 'study-room' | 'profile' | 'friends' | 'library' | 'todos';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'study-room' && <StudyRoom />}
        {currentView === 'profile' && <Profile />}
        {currentView === 'friends' && <Friends />}
        {currentView === 'library' && <Library />}
        {currentView === 'todos' && <TodoList />}
      </main>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setShowAI(!showAI)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-colors z-40"
        aria-label="Toggle AI Assistant"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}
