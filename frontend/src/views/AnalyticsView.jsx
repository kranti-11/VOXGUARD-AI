import React, { useState } from 'react';
import {
  Printer,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function AnalyticsView({ agents = [], conversations = [] }) {
  const [range, setRange] = useState('7d');

  const trendData = [
    { date: 'Oct 28', apex: 91.2, carePulse: 94.0, swiftCart: 86.5 },
    { date: 'Oct 29', apex: 90.8, carePulse: 93.8, swiftCart: 87.2 },
    { date: 'Oct 30', apex: 92.0, carePulse: 94.5, swiftCart: 86.9 },
    { date: 'Oct 31', apex: 91.8, carePulse: 95.0, swiftCart: 88.0 },
    { date: 'Nov 01', apex: 93.1, carePulse: 94.7, swiftCart: 87.5 },
    { date: 'Nov 02', apex: 92.4, carePulse: 94.9, swiftCart: 88.2 },
    { date: 'Nov 03', apex: 94.2, carePulse: 95.8, swiftCart: 89.1 },
  ];

  const agentComparison = [
    { name: 'Apex Bank Voice Concierge', score: 92.4, resolution: 88.5, latency: 850, violations: 8 },
    { name: 'CarePulse Triage', score: 94.8, resolution: 92.0, latency: 780, violations: 2 },
    { name: 'SwiftCart Orders', score: 88.2, resolution: 84.2, latency: 980, violations: 9 },
    { name: 'ShieldGuard Auto Claims', score: 86.5, resolution: 82.0, latency: 910, violations: 7 },
    { name: 'RevGrowth Inbound Qualifier', score: 91.0, resolution: 89.5, latency: 740, violations: 3 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5] print:text-black">
            Analytics & Reports
          </h1>
          <p className="text-xs text-[#929292] mt-0.5 print:text-slate-600">
            Cross-agent benchmarks, SLA latency percentiles, and verifiable compliance audit summaries.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium text-[#F5F5F5] transition-colors print:hidden"
        >
          <Printer className="w-3.5 h-3.5 text-[#929292]" />
          <span>Export QA Report (PDF)</span>
        </button>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
          <span className="text-[10px] uppercase font-mono text-[#737373]">Composite Quality</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F5] mt-1">92.4%</div>
          <div className="text-[10px] text-[#B8F36B] font-mono">+2.1% from baseline</div>
        </div>

        <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
          <span className="text-[10px] uppercase font-mono text-[#737373]">Evaluated Total</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F5] mt-1">12,840</div>
          <div className="text-[10px] text-[#5A5A5A] font-mono">100% evaluated</div>
        </div>

        <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
          <span className="text-[10px] uppercase font-mono text-[#737373]">p95 Latency</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F5] mt-1">1,120ms</div>
          <div className="text-[10px] text-[#B8F36B] font-mono">Within 1,200ms SLA</div>
        </div>

        <div className="bg-[#141414] p-3 rounded-lg border border-[#262626]">
          <span className="text-[10px] uppercase font-mono text-[#737373]">Audit Status</span>
          <div className="text-sm font-bold font-mono text-[#F5F5F5] mt-1.5 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B8F36B]" />
            <span>Passed Tier-1 SLA</span>
          </div>
          <div className="text-[10px] text-[#5A5A5A] font-mono">Continuous monitoring</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-[#141414] p-4 rounded-lg border border-[#262626] space-y-3 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#F5F5F5]">7-Day Quality Score Trends by Agent</h2>
          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <span className="text-[#B8F36B]">Apex Bank</span>
            <span className="text-[#929292]">CarePulse</span>
            <span className="text-[#5A5A5A]">SwiftCart</span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1F1F1F" vertical={false} />
              <XAxis dataKey="date" stroke="#5A5A5A" fontSize={10} tickLine={false} />
              <YAxis domain={[82, 98]} stroke="#5A5A5A" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', fontSize: '11px', color: '#F5F5F5' }} />
              <Line type="monotone" dataKey="apex" stroke="#B8F36B" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="carePulse" stroke="#929292" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="swiftCart" stroke="#5A5A5A" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-[#141414] rounded-lg border border-[#262626] overflow-hidden">
        <div className="p-3 border-b border-[#1F1F1F]">
          <h2 className="text-xs font-semibold text-[#F5F5F5]">Operational Agent Performance Matrix</h2>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
            <tr>
              <th className="py-2.5 px-3">Agent</th>
              <th className="py-2.5 px-3">Quality Score</th>
              <th className="py-2.5 px-3">Resolution Rate</th>
              <th className="py-2.5 px-3">Average Latency</th>
              <th className="py-2.5 px-3">Policy Violations</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F]">
            {agentComparison.map((ag, idx) => (
              <tr key={idx} className="hover:bg-[#1A1A1A]">
                <td className="py-2.5 px-3 font-medium text-[#F5F5F5]">{ag.name}</td>
                <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-[#B8F36B]">{ag.score}%</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#929292]">{ag.resolution}%</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#929292]">{ag.latency}ms</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#F87171] font-semibold">{ag.violations}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B]" />
                    <span className="text-[10px] font-mono text-[#929292]">Compliant</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
