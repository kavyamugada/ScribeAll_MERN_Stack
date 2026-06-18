import React from 'react';

// 🌟 Destructure "user" here from props
export default function Sidebar({ currentView, setCurrentView, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏡' },
    { id: 'new-document', label: 'New Document', icon: '📄' },
    { id: 'history', label: 'History Archive', icon: '🕒' },
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
  ];

  return (
    <aside className="w-72 bg-[#0b0d19] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800">
      {/* Top Section: Branding */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/20">
            S
          </div>
          <div className="text-left">
            <h1 className="font-bold text-white text-lg tracking-wide leading-none">ScribeAll</h1>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase mt-1 block">Workspace</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Dynamic User Identity */}
      <div className="p-4 border-t border-slate-800/60 bg-[#090b14]">
        <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl mb-3 text-left">
          {/* Dynamic Avatar Initial Letter */}
          <div className="w-9 h-9 rounded-lg bg-indigo-900/50 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/20 uppercase">
            {user?.username ? user.username.charAt(0) : (user?.name ? user.name.charAt(0) : 'U')}
          </div>
          <div className="overflow-hidden flex-1">
            {/* 🌟 Dynamic Username display */}
            <p className="text-xs font-semibold text-white truncate">
              {user?.username || user?.name || "Guest User"}
            </p>
            {/* Dynamic User Email */}
            <p className="text-[11px] text-slate-500 truncate">
              {user?.email || "No email attached"}
            </p>
          </div>
        </div>
        
        <button onClick={() => setCurrentView('cross-exam')} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl w-full text-left font-medium mb-1.5 transition-colors">
          <span>⚖️</span> Cross-Examination
        </button>

      
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <span>🚪</span> Sign Out Session
        </button>
      </div>
    </aside>
  );
}