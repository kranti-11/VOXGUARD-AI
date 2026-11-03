import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Activity,
  CheckCircle2,
  GitCompare,
  BarChart3,
  Sparkles,
  Settings,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, activeAlertsCount = 4 }) {
  const mainNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'simulations', label: 'Simulation Lab', icon: FlaskConical },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity, badge: activeAlertsCount > 0 ? activeAlertsCount : null, isAlert: activeAlertsCount > 0 },
    { id: 'evaluations', label: 'QA Evaluations', icon: CheckCircle2 },
    { id: 'regression', label: 'Regression Testing', icon: GitCompare },
    { id: 'human-review', label: 'Human Review', icon: UserCheck },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'advisor', label: 'AI Advisor', icon: Sparkles },
  ];

  return (
    <aside className="w-56 bg-[#0D0D0D] border-r border-[#262626] flex flex-col justify-between select-none z-20 flex-shrink-0">
      {/* Top Brand Header */}
      <div>
        <div className="px-4 py-4 border-b border-[#1F1F1F]">
          <div className="flex items-center space-x-2.5">
            {/* Custom geometric logo icon */}
            <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#383838] flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-[#B8F36B] rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-semibold text-xs tracking-wider text-[#F5F5F5]">VOXGUARD</span>
                <span className="text-[9px] font-mono font-bold text-[#B8F36B] tracking-tight">AI</span>
              </div>
              <p className="text-[9px] font-mono text-[#5A5A5A] tracking-widest mt-1">VOICE INTELLIGENCE</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-2 py-3">
          <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#5A5A5A]">
            Platform
          </div>
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors group ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F5F5F5] font-medium border border-[#333333]'
                      : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-[#141414] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#B8F36B]' : 'text-[#737373] group-hover:text-[#F5F5F5]'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      item.isAlert
                        ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/20'
                        : 'bg-[#1F1F1F] text-[#929292]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-[#1F1F1F] space-y-1">
        {/* Settings button */}
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            currentView === 'settings'
              ? 'bg-[#1A1A1A] text-[#F5F5F5] border border-[#333333]'
              : 'text-[#929292] hover:text-[#F5F5F5] hover:bg-[#141414]'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-[#737373]" />
          <span>Settings</span>
        </button>

        {/* System Status: All systems operational */}
        <div className="px-2.5 py-2 flex items-center justify-between text-[11px] text-[#929292]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B]"></span>
            <span className="text-[10px] font-mono text-[#737373]">All systems operational</span>
          </div>
        </div>

        {/* User profile */}
        <div className="px-2.5 py-2 border-t border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-[10px] font-mono font-bold text-[#F5F5F5]">
              SC
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-[#F5F5F5]">Sarah Chen</p>
              <p className="text-[9px] font-mono text-[#5A5A5A]">QA Lead</p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#5A5A5A]">v2.4</span>
        </div>
      </div>
    </aside>
  );
}
