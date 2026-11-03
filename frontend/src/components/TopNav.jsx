import React from 'react';
import { Search, ChevronDown, Bell, Play } from 'lucide-react';

export default function TopNav({
  currentView = 'overview',
  selectedAgent,
  setSelectedAgent,
  agents = [],
  onQuickSimulate,
  searchQuery,
  setSearchQuery,
  activeAlerts = []
}) {
  const viewLabels = {
    overview: 'OVERVIEW',
    simulations: 'SIMULATION LAB',
    monitoring: 'LIVE MONITORING',
    evaluations: 'QA EVALUATIONS',
    regression: 'REGRESSION TESTING',
    'human-review': 'HUMAN REVIEW',
    analytics: 'ANALYTICS & REPORTS',
    advisor: 'AI ADVISOR',
    settings: 'SETTINGS'
  };

  return (
    <header className="h-12 border-b border-[#262626] bg-[#090909] px-5 flex items-center justify-between z-10 sticky top-0">
      {/* Left: Breadcrumbs & Agent selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider">
          <span className="text-[#5A5A5A]">WORKSPACE</span>
          <span className="text-[#383838]">/</span>
          <span className="text-[#F5F5F5] font-semibold">{viewLabels[currentView] || 'CONSOLE'}</span>
        </div>

        <div className="h-3 w-[1px] bg-[#262626] hidden md:block" />

        {/* Minimal Agent Selector */}
        <div className="relative items-center hidden md:flex">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-[#141414] border border-[#262626] hover:border-[#383838] rounded px-2.5 py-1 text-[11px] text-[#D4D4D4] focus:outline-none cursor-pointer pr-6 appearance-none transition-colors"
          >
            <option value="all">All Agents (5)</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#737373] absolute right-1.5 pointer-events-none" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 text-[#5A5A5A] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts, tags..."
            className="w-full bg-[#141414] border border-[#262626] focus:border-[#383838] rounded pl-8 pr-7 py-1 text-xs text-[#F5F5F5] placeholder-[#5A5A5A] focus:outline-none transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#5A5A5A] bg-[#1F1F1F] px-1 rounded border border-[#2B2B2B]">
            /
          </kbd>
        </div>

        {/* Demo stream indicator */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#141414] border border-[#262626] text-[10px] font-mono text-[#929292]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B]"></span>
          <span>DEMO DATA</span>
        </div>

        {/* Quick Simulation Button */}
        <button
          onClick={onQuickSimulate}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Run Simulation</span>
        </button>

        {/* Notification Alert icon */}
        <div className="relative">
          <button className="p-1 rounded bg-[#141414] border border-[#262626] text-[#929292] hover:text-[#F5F5F5] transition-colors">
            <Bell className="w-3.5 h-3.5" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F87171]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
