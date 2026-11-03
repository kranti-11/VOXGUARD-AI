import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RegressionView({ regressionSuites = [], agents = [] }) {
  const [activeSuite, setActiveSuite] = useState(regressionSuites[0] || null);
  const [isRunningGate, setIsRunningGate] = useState(false);

  const handleRunGate = async () => {
    setIsRunningGate(true);
    try {
      const res = await fetch('/api/regression/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'agent_banking_01',
          targetVersion: 'v2.5.0-rc2'
        })
      });
      const data = await res.json();
      setActiveSuite(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningGate(false);
    }
  };

  const chartData = [
    { name: 'Intent', prev: 88, next: 95 },
    { name: 'Accuracy', prev: 84, next: 94 },
    { name: 'Policy', prev: 72, next: 96 },
    { name: 'Barge-In', prev: 76, next: 93 },
    { name: 'Latency', prev: 80, next: 92 },
    { name: 'Resolution', prev: 82, next: 90 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Regression Testing
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Agent release quality gate to prevent regressions before deployment.
          </p>
        </div>

        <button
          onClick={handleRunGate}
          disabled={isRunningGate}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
        >
          {isRunningGate ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
          <span>{isRunningGate ? 'Evaluating Gate...' : 'Run Quality Gate Suite'}</span>
        </button>
      </div>

      {activeSuite && (
        <div className="space-y-4">
          {/* Comparison Panels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
              <span className="text-[10px] uppercase font-mono text-[#737373]">Baseline Version</span>
              <div className="text-base font-bold font-mono text-[#929292] mt-1">{activeSuite.previousVersion}</div>
              <div className="text-xs font-mono text-[#5A5A5A]">{activeSuite.previousScore}% QA Score</div>
            </div>

            <div className="bg-[#141414] p-3 rounded-lg border border-[#383838]">
              <span className="text-[10px] uppercase font-mono text-[#B8F36B]">Release Candidate</span>
              <div className="text-base font-bold font-mono text-[#F5F5F5] mt-1">{activeSuite.newVersion}</div>
              <div className="text-xs font-mono text-[#B8F36B] font-semibold">{activeSuite.newScore}% QA Score</div>
            </div>

            <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
              <span className="text-[10px] uppercase font-mono text-[#737373]">Score Delta</span>
              <div className="text-base font-bold font-mono text-[#B8F36B] mt-1 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{activeSuite.scoreDelta}</span>
              </div>
              <div className="text-[10px] text-[#5A5A5A]">Statistical improvement</div>
            </div>

            <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
              <span className="text-[10px] uppercase font-mono text-[#737373]">Gate Outcome</span>
              <div className="text-sm font-bold font-mono text-[#F5F5F5] mt-1 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B8F36B]" />
                <span>{activeSuite.status}</span>
              </div>
              <div className="text-[10px] font-mono text-[#5A5A5A]">
                +{activeSuite.resolvedIssuesCount} Fixed • {activeSuite.newlyIntroducedFailuresCount} Regressions
              </div>
            </div>
          </div>

          {/* Benchmark Chart */}
          <div className="bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Dimension Benchmark Comparison</h2>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-[#52525B] rounded-xs" /><span className="text-[#929292]">{activeSuite.previousVersion}</span></span>
                <span className="flex items-center space-x-1"><span className="w-2 h-2 bg-[#B8F36B] rounded-xs" /><span className="text-[#929292]">{activeSuite.newVersion}</span></span>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1F1F1F" vertical={false} />
                  <XAxis dataKey="name" stroke="#5A5A5A" fontSize={10} tickLine={false} />
                  <YAxis stroke="#5A5A5A" fontSize={10} domain={[60, 100]} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', fontSize: '11px', color: '#F5F5F5' }} />
                  <Bar dataKey="prev" fill="#52525B" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="next" fill="#B8F36B" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resolved Vulnerabilities Diff Table */}
          <div className="bg-[#141414] rounded-lg border border-[#262626] overflow-hidden">
            <div className="p-3 border-b border-[#1F1F1F]">
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Verified Fixed Vulnerabilities</h2>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
                <tr>
                  <th className="py-2 px-3">Scenario</th>
                  <th className="py-2 px-3">Baseline</th>
                  <th className="py-2 px-3">Candidate</th>
                  <th className="py-2 px-3">Remediation Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {activeSuite.resolvedIssues.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A1A]">
                    <td className="py-2.5 px-3 font-medium text-[#F5F5F5]">{item.scenario}</td>
                    <td className="py-2.5 px-3 text-[#F87171] font-mono text-[11px]">{item.previousOutcome}</td>
                    <td className="py-2.5 px-3 text-[#B8F36B] font-mono text-[11px] font-semibold">{item.newOutcome}</td>
                    <td className="py-2.5 px-3 text-xs text-[#929292]">{item.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
