import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AdvisorView({ insights = [], agents = [] }) {
  const [insightList, setInsightList] = useState(insights);
  const [copiedId, setCopiedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'agent_banking_01');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgentId })
      });
      const data = await res.json();
      setInsightList(prev => [data, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            AI Improvement Advisor
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Automated prompt engineering, guardrail patches, and VAD audio tuning recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded px-2.5 py-1 text-xs text-[#D4D4D4] focus:outline-none"
          >
            {agents.map(ag => (
              <option key={ag.id} value={ag.id}>{ag.name}</option>
            ))}
          </select>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Plan'}</span>
          </button>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insightList.map((ins) => (
          <div
            key={ins.id}
            className="bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F1F1F] pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                    ins.priority === 'Urgent'
                      ? 'bg-[#3B1818] text-[#F87171]'
                      : 'bg-[#3B2D18] text-[#EAB66A]'
                  }`}>
                    {ins.priority}
                  </span>
                  <span className="text-[10px] font-mono text-[#737373]">
                    {ins.category}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-[#F5F5F5] mt-1">{ins.title}</h2>
                <p className="text-[11px] text-[#737373]">Target: {ins.agentName}</p>
              </div>

              <div className="text-right">
                <span className="text-sm font-mono font-bold text-[#B8F36B]">{ins.impactScore}</span>
                <span className="text-[9px] font-mono text-[#5A5A5A] block">Projected Quality Uplift</span>
              </div>
            </div>

            <p className="text-xs text-[#D4D4D4] leading-relaxed">
              {ins.summary}
            </p>

            {/* Actionable Steps */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] block">
                Prescribed Remediation Steps:
              </span>
              <ul className="space-y-1 text-xs text-[#929292]">
                {(ins.actionableSteps || []).map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#B8F36B] font-mono text-[11px]">0{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prompt Patch */}
            {ins.suggestedPromptPatch && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373]">
                    Suggested System Prompt Directive
                  </span>
                  <button
                    onClick={() => handleCopy(ins.id, ins.suggestedPromptPatch)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#1F1F1F] hover:bg-[#262626] text-[10px] font-mono text-[#D4D4D4] transition-colors"
                  >
                    {copiedId === ins.id ? <Check className="w-3 h-3 text-[#B8F36B]" /> : <Copy className="w-3 h-3 text-[#737373]" />}
                    <span>{copiedId === ins.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-[#0D0D0D] p-3 rounded border border-[#1F1F1F] font-mono text-[11px] text-[#D4D4D4] overflow-x-auto leading-relaxed">
                  {ins.suggestedPromptPatch}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
