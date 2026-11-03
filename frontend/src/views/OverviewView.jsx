import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  ArrowRight,
  Clock,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function OverviewView({
  analyticsData,
  conversations = [],
  onSelectConversation,
  onNavigateToSimulations
}) {
  const [timeRange, setTimeRange] = useState('24h');

  const metrics = analyticsData?.metrics || {
    totalConversations: 12840,
    totalConversationsDelta: '+18.4%',
    avgQualityScore: 92.4,
    avgQualityScoreDelta: '+2.1%',
    resolutionRate: 87.6,
    resolutionRateDelta: '+4.3%',
    policyViolations: 24,
    policyViolationsDelta: '-14.0%'
  };

  const volumeTrend = analyticsData?.volumeTrend || [
    { time: '00:00', total: 420, passed: 390, failed: 30 },
    { time: '04:00', total: 210, passed: 198, failed: 12 },
    { time: '08:00', total: 890, passed: 810, failed: 80 },
    { time: '12:00', total: 1650, passed: 1480, failed: 170 },
    { time: '16:00', total: 1420, passed: 1290, failed: 130 },
    { time: '20:00', total: 980, passed: 910, failed: 70 }
  ];

  const failureCategories = analyticsData?.failureCategories || [
    { category: 'Policy Compliance', count: 48 },
    { category: 'High Latency', count: 35 },
    { category: 'Hallucinations', count: 28 },
    { category: 'Customer Frustration', count: 22 },
    { category: 'Incomplete Resolution', count: 18 }
  ];

  const criticalIssues = [
    {
      id: 'iss_1',
      convId: 'conv_8912_bank',
      title: 'Refund promised without 2FA or compliance check',
      category: 'Policy Compliance',
      agent: 'Apex Bank Voice Concierge',
      severity: 'Critical',
      time: '12m ago'
    },
    {
      id: 'iss_2',
      convId: 'conv_8915_insur',
      title: 'Agent accepted third-party legal liability on collision',
      category: 'Hallucinations',
      agent: 'ShieldGuard Auto Claims',
      severity: 'Critical',
      time: '34m ago'
    },
    {
      id: 'iss_3',
      convId: 'conv_8914_ecom',
      title: 'Telephony turn-taking latency spiked to 2420ms',
      category: 'Latency SLA',
      agent: 'SwiftCart Orders',
      severity: 'High',
      time: '1h ago'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Command Center
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Monitor, evaluate and improve your voice agents.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Date range selector */}
          <div className="flex items-center bg-[#141414] border border-[#262626] rounded p-0.5 text-[11px] font-mono text-[#929292]">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === range
                    ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold'
                    : 'hover:text-[#F5F5F5]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={onNavigateToSimulations}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-xs font-medium text-[#F5F5F5] transition-colors"
          >
            <span>Launch Simulation</span>
            <ArrowRight className="w-3 h-3 text-[#929292]" />
          </button>
        </div>
      </div>

      {/* 4 Compact Metric Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#141414] p-3.5 rounded-lg border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#929292]">
            <span>Total Conversations</span>
            <span className="flex items-center text-[10px] font-mono text-[#B8F36B] space-x-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{metrics.totalConversationsDelta}</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#F5F5F5] tracking-tight">
            {metrics.totalConversations.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[#5A5A5A]">Streamed & evaluated</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#141414] p-3.5 rounded-lg border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#929292]">
            <span>Average Quality Score</span>
            <span className="flex items-center text-[10px] font-mono text-[#B8F36B] space-x-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{metrics.avgQualityScoreDelta}</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#F5F5F5] tracking-tight">
            {metrics.avgQualityScore}%
          </div>
          <div className="text-[10px] font-mono text-[#5A5A5A]">Benchmark &gt; 90.0%</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#141414] p-3.5 rounded-lg border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#929292]">
            <span>Resolution Rate</span>
            <span className="flex items-center text-[10px] font-mono text-[#B8F36B] space-x-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>{metrics.resolutionRateDelta}</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#F5F5F5] tracking-tight">
            {metrics.resolutionRate}%
          </div>
          <div className="text-[10px] font-mono text-[#5A5A5A]">Autonomous resolution</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#141414] p-3.5 rounded-lg border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#929292]">
            <span>Critical Issues</span>
            <span className="flex items-center text-[10px] font-mono text-[#F87171] space-x-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>{metrics.policyViolationsDelta}</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#F87171] tracking-tight">
            {metrics.policyViolations}
          </div>
          <div className="text-[10px] font-mono text-[#5A5A5A]">Requires attention</div>
        </div>
      </div>

      {/* Main Grid: Charts & Critical Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversation Volume Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#141414] p-4 rounded-lg border border-[#262626] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Conversation Volume & Pass Rate</h2>
              <p className="text-[10px] font-mono text-[#5A5A5A]">Aggregated telephony evaluations over {timeRange}</p>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#52525B]"></span>
                <span className="text-[#929292]">Total</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#B8F36B]"></span>
                <span className="text-[#929292]">Passed</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1F1F1F" vertical={false} />
                <XAxis dataKey="time" stroke="#5A5A5A" fontSize={10} tickLine={false} />
                <YAxis stroke="#5A5A5A" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', borderRadius: '6px', fontSize: '11px', color: '#F5F5F5' }}
                />
                <Area type="monotone" dataKey="total" stroke="#52525B" strokeWidth={1.5} fillOpacity={0.08} fill="#52525B" />
                <Area type="monotone" dataKey="passed" stroke="#B8F36B" strokeWidth={1.5} fillOpacity={0.15} fill="#B8F36B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Critical Issues (1 col) */}
        <div className="bg-[#141414] p-4 rounded-lg border border-[#262626] space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Active Critical Issues</h2>
              <span className="text-[10px] font-mono text-[#F87171]">{criticalIssues.length} Unresolved</span>
            </div>

            <div className="space-y-2">
              {criticalIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectConversation({ id: issue.convId })}
                  className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F] hover:border-[#333333] cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-[#3B1818] text-[#F87171] font-semibold">
                      {issue.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#5A5A5A]">{issue.time}</span>
                  </div>
                  <p className="text-[11px] font-medium text-[#F5F5F5] leading-snug line-clamp-2">
                    {issue.title}
                  </p>
                  <p className="text-[10px] text-[#737373]">{issue.agent}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToSimulations()}
            className="w-full py-1.5 rounded bg-[#1A1A1A] hover:bg-[#202020] text-[11px] font-medium text-[#929292] hover:text-[#F5F5F5] border border-[#262626] transition-colors"
          >
            Run Remediation Suite &rarr;
          </button>
        </div>
      </div>

      {/* Recent Simulation & Conversation Activity Table */}
      <div className="bg-[#141414] rounded-lg border border-[#262626] overflow-hidden">
        <div className="p-3.5 border-b border-[#1F1F1F] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-[#F5F5F5]">Recent Telephony Evaluations</h2>
            <p className="text-[10px] text-[#5A5A5A]">Real-time and simulated conversation stream</p>
          </div>
          <span className="text-[10px] font-mono text-[#5A5A5A]">
            Showing 6 of {conversations.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
              <tr>
                <th className="py-2.5 px-3.5">ID</th>
                <th className="py-2.5 px-3.5">Agent</th>
                <th className="py-2.5 px-3.5">Intent</th>
                <th className="py-2.5 px-3.5">Sentiment</th>
                <th className="py-2.5 px-3.5">Latency</th>
                <th className="py-2.5 px-3.5">Quality</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {conversations.slice(0, 6).map((conv) => {
                const score = conv.scores?.overall || 85;
                const isPassed = conv.status === 'Passed';
                const isFailed = conv.status === 'Failed';

                return (
                  <tr
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#929292] group-hover:text-[#F5F5F5]">
                      {conv.id}
                    </td>
                    <td className="py-2.5 px-3.5 font-medium text-[#F5F5F5]">
                      {conv.agentName}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#929292] max-w-xs truncate text-[11px]">
                      {conv.customerIntent}
                    </td>
                    <td className="py-2.5 px-3.5 text-[11px]">
                      <span className={`font-mono text-[10px] ${
                        conv.sentiment === 'Positive'
                          ? 'text-[#B8F36B]'
                          : conv.sentiment === 'Negative'
                          ? 'text-[#F87171]'
                          : 'text-[#929292]'
                      }`}>
                        {conv.sentiment}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#929292]">
                      {conv.avgLatencyMs}ms
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[11px] font-semibold text-[#F5F5F5]">
                      {score.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isPassed ? 'bg-[#B8F36B]' : isFailed ? 'bg-[#F87171]' : 'bg-[#EAB66A]'
                        }`} />
                        <span className="text-[10px] font-mono text-[#929292]">{conv.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConversation(conv);
                        }}
                        className="text-[10px] font-mono text-[#929292] hover:text-[#B8F36B] transition-colors"
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
