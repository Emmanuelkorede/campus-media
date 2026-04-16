import { useNavigate, useLocation } from "react-router";
import { Home, BookOpen, Rss, User } from "lucide-react"; // Install lucide-react or use SVG

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', path: '/stream', icon: <Home size={20} /> },
    { id: 'cbt', label: 'CBT', path: '/cbt-list', icon: <BookOpen size={20} /> },
    { id: 'feeds', label: 'Feeds', path: '/feeds', icon: <Rss size={20} /> },
    { id: 'profile', label: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
              isActive ? "text-blue-600 font-bold" : "text-slate-400"
            }`}
          >
            <div className={isActive ? "scale-110 transition-transform" : ""}>
              {tab.icon}
            </div>
            <span className="text-[10px] uppercase tracking-tighter">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}