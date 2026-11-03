import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';

export default function LiveMonitoringView({
  monitoringData,
  onSelectConversation,
  conversations = []
}) {
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [activeCalls, setActiveCalls] = useState(monitoringData?.activeCalls || []);
  const [severityFilter, setSeverityFilter] = useState('all');

  const alerts = [
    {
      id: 'alt_1',
      type: 'POLICY VIOLATION',
      title: 'Agent promised $450 refund without 2FA or compliance approval',
      severity: 'Critical',
      callId: 'call_vxd_7720',
      convId: 'conv_8912_bank',
      agent: 'Apex Bank Voice Concierge',
      time: '14s ago'
    },
    {
      id: 'alt_2',
      type: 'HIGH LATENCY',
      title: 'Response latency exceeded SLA ceiling (2450ms > 1200ms)',
      severity: 'High',
      callId: 'call_vxd_7719',
      convId: 'conv_8914_ecom',
      agent: 'SwiftCart Orders',
      time: '42s ago'
    },
    {
      id: 'alt_3',
      type: 'HALLUCINATION',
      title: 'Fabricated zero-deductible policy & accepted legal fault',
      severity: 'Critical',
      callId: 'call_vxd_7720',
      convId: 'conv_8915_insur',
      agent: 'ShieldGuard Auto Claims',
      time: '1m ago'
    },
    {
      id: 'alt_4',
      type: 'BARGE-IN FAILED',
      title: 'Voice Activity Detection continued speech for 1.8s over caller',
      severity: 'Medium',
      callId: 'call_vxd_7719',
      convId: 'conv_8918_health_interrupt',
      agent: 'CarePulse Triage',
      time: '3m ago'
    }
  ];

  const handleSimulateNewCall = async () => {
    try {
      const res = await fetch('/api/monitoring/simulate', { method: 'POST' });
      if (res.ok) {
        const newCall = await res.json();
        setActiveCalls(prev => [newCall, ...prev.slice(0, 6)]);
      }
    } catch (e) {
      console.error('Failed to simulate incoming call:', e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Live Monitoring
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Real-time telephony observatory, latency jitter, and automated anomaly detection.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              isLiveActive
                ? 'bg-[#141414] text-[#D4D4D4] border-[#262626] hover:bg-[#1A1A1A]'
                : 'bg-[#1F1F1F] text-[#B8F36B] border-[#383838]'
            }`}
          >
            {isLiveActive ? <Pause className="w-3 h-3 text-[#737373]" /> : <Play className="w-3 h-3 text-[#B8F36B] fill-current" />}
            <span>{isLiveActive ? 'Pause Stream' : 'Resume'}</span>
          </button>

          <button
            onClick={handleSimulateNewCall}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] text-xs font-medium text-[#F5F5F5] transition-colors"
          >
            <Plus className="w-3 h-3 text-[#B8F36B]" />
            <span>Simulate Incoming Call</span>
          </button>
        </div>
      </div>

      {/* Compact Telemetry Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        <div className="bg-[#141414] p-3 rounded border border-[#262626] space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-[#929292] uppercase font-mono">
            <span>Active Calls</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B] animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-[#F5F5F5]">{activeCalls.length}</div>
          <div className="text-[9px] font-mono text-[#5A5A5A]">100% audio uptime</div>
        </div>

        <div className="bg-[#141414] p-3 rounded border border-[#262626] space-y-0.5">
          <span className="text-[10px] text-[#929292] uppercase font-mono">Turn Latency</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F5]">780ms</div>
          <div className="text-[9px] font-mono text-[#B8F36B]">p95: 1120ms (Within SLA)</div>
        </div>

        <div className="bg-[#141414] p-3 rounded border border-[#262626] space-y-0.5">
          <span className="text-[10px] text-[#929292] uppercase font-mono">Current Resolution</span>
          <div className="text-xl font-bold font-mono text-[#F5F5F5]">88.4%</div>
          <div className="text-[9px] font-mono text-[#5A5A5A]">First-contact resolve</div>
        </div>

        <div className="bg-[#141414] p-3 rounded border border-[#262626] space-y-0.5">
          <span className="text-[10px] text-[#929292] uppercase font-mono">Active Alerts</span>
          <div className="text-xl font-bold font-mono text-[#F87171]">
            {alerts.filter(a => a.severity === 'Critical').length}
          </div>
          <div className="text-[9px] font-mono text-[#F87171]">Critical attention</div>
        </div>

        <div className="bg-[#141414] p-3 rounded border border-[#262626] space-y-0.5 col-span-2 lg:col-span-1">
          <span className="text-[10px] text-[#929292] uppercase font-mono">Mode</span>
          <div className="text-xs font-mono font-bold text-[#F5F5F5] mt-1">DEMO EMULATION</div>
          <div className="text-[9px] font-mono text-[#5A5A5A]">Simulated WebRTC stream</div>
        </div>
      </div>

      {/* Main Grid: Active Table & Live Issue Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Conversation Dense Table (2 cols) */}
        <div className="lg:col-span-2 bg-[#141414] rounded-lg border border-[#262626] overflow-hidden space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <div>
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Live Active Conversation Stream</h2>
              <p className="text-[10px] text-[#5A5A5A]">Inspect turn-by-turn latency and sentiment in real time</p>
            </div>
            <span className="text-[10px] font-mono text-[#5A5A5A]">{activeCalls.length} Channels open</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
                <tr>
                  <th className="py-2 px-3">Call ID</th>
                  <th className="py-2 px-3">Agent</th>
                  <th className="py-2 px-3">Region</th>
                  <th className="py-2 px-3">Duration</th>
                  <th className="py-2 px-3">Latency</th>
                  <th className="py-2 px-3">Score</th>
                  <th className="py-2 px-3">Health</th>
                  <th className="py-2 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {activeCalls.map((call) => {
                  const isHealthy = call.status === 'Healthy';
                  const isCrit = call.status === 'Critical';

                  return (
                    <tr
                      key={call.id}
                      onClick={() => onSelectConversation({ id: 'conv_8912_bank' })}
                      className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#F5F5F5] font-semibold">
                        {call.callId}
                      </td>
                      <td className="py-2.5 px-3 text-[#F5F5F5] text-xs font-medium">
                        {call.agentName}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] font-mono text-[#737373]">
                        {call.callerRegion}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#929292]">
                        {call.durationSeconds}s
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <span className={call.currentLatencyMs > 1200 ? 'text-[#F87171] font-bold' : 'text-[#929292]'}>
                          {call.currentLatencyMs}ms
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#B8F36B] font-semibold">
                        {call.qualityScore}%
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isHealthy ? 'bg-[#B8F36B]' : isCrit ? 'bg-[#F87171] animate-pulse' : 'bg-[#EAB66A]'
                          }`} />
                          <span className="text-[10px] font-mono text-[#929292]">{call.status}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectConversation({ id: 'conv_8912_bank' });
                          }}
                          className="text-[10px] font-mono text-[#929292] group-hover:text-[#B8F36B] transition-colors"
                        >
                          View &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Issue Alerts Feed (1 col) */}
        <div className="bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h2 className="text-xs font-semibold text-[#F5F5F5]">Automated Anomaly Alerts</h2>
            <span className="text-[10px] font-mono text-[#5A5A5A]">{alerts.length} Triggered</span>
          </div>

          <div className="space-y-2">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                onClick={() => onSelectConversation({ id: alt.convId })}
                className="p-2.5 rounded bg-[#0D0D0D] border border-[#1F1F1F] hover:border-[#383838] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                    alt.severity === 'Critical'
                      ? 'bg-[#3B1818] text-[#F87171]'
                      : 'bg-[#3B2D18] text-[#EAB66A]'
                  }`}>
                    {alt.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#5A5A5A]">{alt.time}</span>
                </div>

                <p className="text-[11px] font-medium text-[#F5F5F5] leading-snug">
                  {alt.title}
                </p>

                <p className="text-[10px] text-[#737373] font-mono">{alt.agent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
