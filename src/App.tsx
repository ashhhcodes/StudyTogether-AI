import { useState } from "react";

import AppRoutes from "@/routes/AppRoutes";
import { AIAssistant } from "@/components/AIAssistant";

export default function App() {
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <AppRoutes />

      {/* AI Assistant Drawer */}
      {showAI && (
        <AIAssistant onClose={() => setShowAI(false)} />
      )}

      {/* Floating AI Button */}
{!showAI && (
  <button
    onClick={() => setShowAI(true)}
    className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-2xl transition-all"
  >
    Ask AI
  </button>
)}
    </>
  );
}