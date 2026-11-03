import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { WEIGHT_CONFIG } from '../components/TranscriptDrawer';

export default function EvaluationsView({
  conversations = [],
  agents = [],
  onSelectConversation
}) {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  let filtered = conversations.filter(c => {
    if (selectedAgentFilter !== 'all' && c.agentId !== selectedAgentFilter) return false;
    if (selectedStatusFilter !== 'all' && c.status.toLowerCase() !== selectedStatusFilter.toLowerCase()) return false;
    if (selectedCategoryFilter !== 'all' && c.failureCategory !== selectedCategoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchIntent = c.customerIntent.toLowerCase().includes(q);
      const matchIssue = (c.detectedIssue || '').toLowerCase().includes(q);
      if (!matchId && !matchIntent && !matchIssue) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            QA Evaluations
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Automated conversation scorecard across 6 weighted operational dimensions.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#5A5A5A]">
          <span>FORMULA: WEIGHTED 100%</span>
        </div>
      </div>

      {/* Compact Scoring Dimension Weights Bar */}
      <div className="bg-[#141414] rounded-lg border border-[#262626] p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {WEIGHT_CONFIG.map((dim) => (
            <div key={dim.key} className="bg-[#0D0D0D] p-2 rounded border border-[#1F1F1F]">
              <div className="flex justify-between items-center text-[10px] text-[#929292]">
                <span className="truncate">{dim.label}</span>
                <span className="font-mono text-[#F5F5F5] font-semibold">{dim.weight * 100}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#141414] p-3 rounded-lg border border-[#262626] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#5A5A5A] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search intent or failure keyword..."
              className="w-full bg-[#0D0D0D] border border-[#262626] rounded pl-8 pr-3 py-1 text-xs text-[#F5F5F5] placeholder-[#5A5A5A] focus:outline-none focus:border-[#383838]"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Agent Filter */}
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] rounded px-2.5 py-1 text-xs text-[#D4D4D4] focus:outline-none"
          >
            <option value="all">All Agents</option>
            {agents.map(ag => (
              <option key={ag.id} value={ag.id}>{ag.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] rounded px-2.5 py-1 text-xs text-[#D4D4D4] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="passed">Passed</option>
            <option value="warning">Warning</option>
            <option value="failed">Failed</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] rounded px-2.5 py-1 text-xs text-[#D4D4D4] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Policy Compliance">Policy Compliance</option>
            <option value="Hallucinations">Hallucinations</option>
            <option value="Latency">High Latency</option>
            <option value="Customer Frustration">Customer Frustration</option>
            <option value="Conversation Quality">Quality</option>
          </select>
        </div>
      </div>

      {/* Dense Evaluations Table */}
      <div className="bg-[#141414] rounded-lg border border-[#262626] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
              <tr>
                <th className="py-2.5 px-3">Conversation ID</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Intent</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Detected Issue</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filtered.map((conv) => {
                const score = conv.scores?.overall || 82;
                const isPassed = conv.status === 'Passed';
                const isFailed = conv.status === 'Failed';

                return (
                  <tr
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#929292] group-hover:text-[#F5F5F5]">
                      {conv.id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#F5F5F5]">
                      {conv.agentName}
                    </td>
                    <td className="py-2.5 px-3 text-[#929292] max-w-xs truncate text-[11px]">
                      {conv.customerIntent}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-[#F5F5F5]">
                      {score.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-[#929292] max-w-sm truncate text-[11px]">
                      {conv.detectedIssue && conv.detectedIssue !== 'None' ? conv.detectedIssue : 'Clean'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                        conv.severity === 'Critical'
                          ? 'bg-[#3B1818] text-[#F87171]'
                          : conv.severity === 'High'
                          ? 'bg-[#3B2D18] text-[#EAB66A]'
                          : 'bg-[#1F1F1F] text-[#737373]'
                      }`}>
                        {conv.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isPassed ? 'bg-[#B8F36B]' : isFailed ? 'bg-[#F87171]' : 'bg-[#EAB66A]'
                        }`} />
                        <span className="text-[10px] font-mono text-[#929292]">{conv.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConversation(conv);
                        }}
                        className="text-[10px] font-mono text-[#929292] group-hover:text-[#B8F36B] transition-colors"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
