import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Sliders,
  AlertCircle,
  Sparkles,
  Bot,
  Square
} from 'lucide-react';

const SCENARIOS = [
  { id: 'Angry Customer', label: 'Angry Customer', desc: 'Profanity, shouting, high acoustic arousal', tag: 'STRESS' },
  { id: 'Interruptions', label: 'Interruptions & Barge-In', desc: 'Speaking mid-sentence over the voice agent', tag: 'VAD' },
  { id: 'Background Noise', label: 'Background Noise & Low SNR', desc: 'Sirens, airport announcements, 70dB ambient noise', tag: 'ACOUSTIC' },
  { id: 'Policy Violations', label: 'Policy Violations & Auth', desc: 'Demanding immediate refunds without 2FA', tag: 'SECURITY' },
  { id: 'Difficult Questions', label: 'Difficult Edge Inquiries', desc: 'Complex regulatory or out-of-flow questions', tag: 'REASONING' },
  { id: 'Hallucination Testing', label: 'Hallucination Probing', desc: 'Testing unapproved promotions and fabricated terms', tag: 'GROUNDING' },
  { id: 'Repeated Queries', label: 'Repeated Queries & Loops', desc: 'Customer looping identical question repeatedly', tag: 'MEMORY' },
  { id: 'Multilingual Conversations', label: 'Multilingual & Code-Switching', desc: 'Spanish, Hindi, Hinglish telephony prompts', tag: 'LOCALIZATION' },
  { id: 'Unexpected Inputs', label: 'Unexpected Inputs & Silence', desc: 'Non-lexical sounds and sudden audio drops', tag: 'ROBUSTNESS' }
];

export default function SimulationLabView({
  agents = [],
  onSelectConversation,
  simulations = [],
  onSimulationComplete
}) {
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'agent_banking_01');
  const [simCount, setSimCount] = useState(10);
  const [selectedScenarios, setSelectedScenarios] = useState([
    'Angry Customer',
    'Policy Violations',
    'Interruptions',
    'Hallucination Testing'
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScenarioName, setCurrentScenarioName] = useState('');
  const [streamingLog, setStreamingLog] = useState([]);
  const [activeSimulationResult, setActiveSimulationResult] = useState(simulations[0] || null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const toggleScenario = (id) => {
    if (selectedScenarios.includes(id)) {
      if (selectedScenarios.length > 1) {
        setSelectedScenarios(selectedScenarios.filter(s => s !== id));
      }
    } else {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const handleCancel = () => {
    setIsSimulating(false);
    setProgress(0);
    setCurrentScenarioName('Simulation cancelled by user.');
    fetch('/api/simulations/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }).catch(() => {});
  };

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    setProgress(0);
    setStreamingLog([]);

    const steps = [
      { p: 15, text: `Synthesizing ${simCount} adversarial customer conversations for ${selectedAgent?.name}...` },
      { p: 35, text: `Injecting edge vectors: Unauthorized refund requests, barge-ins, and ambient noise...` },
      { p: 55, text: `Evaluating generated transcripts using Sarvam AI (sarvam-105b)...` },
      { p: 75, text: `Auditing multi-dimensional scores (Accuracy, Policy, Latency SLA)...` },
      { p: 90, text: `Extracting evidence quotes and prescriptive prompt recommendations...` },
      { p: 100, text: `Simulation suite completed.` }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 450));
      setProgress(step.p);
      setCurrentScenarioName(step.text);
      setStreamingLog(prev => [...prev.slice(-3), `[${new Date().toLocaleTimeString()}] ${step.text}`]);
    }

    try {
      const res = await fetch('/api/simulations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgentId,
          count: simCount,
          scenarios: selectedScenarios
        })
      });
      const data = await res.json();
      setActiveSimulationResult(data);
      if (onSimulationComplete) onSimulationComplete(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Simulation Lab
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            Run realistic adversarial conversations and evaluate with Sarvam AI before deployment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isSimulating ? (
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#3B1818] hover:bg-[#4D1F1F] text-[#F87171] border border-[#F87171]/30 text-xs font-semibold transition-colors"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Cancel Simulation</span>
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run {simCount} Simulations</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workbench: Left Config + Center Scenario Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel: Target Agent & Volume */}
        <div className="bg-[#141414] p-4 rounded-lg border border-[#262626] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#929292]">
              Configuration
            </h2>
            <span className="text-[10px] font-mono text-[#5A5A5A]">STEP 1 OF 2</span>
          </div>

          {/* Select Agent */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#D4D4D4]">Target Voice Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#262626] rounded px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#383838]"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.version})
                </option>
              ))}
            </select>
            <p className="text-[10px] font-mono text-[#5A5A5A]">
              Prompt snippet: {selectedAgent?.systemPromptSnippet ? selectedAgent.systemPromptSnippet.slice(0, 70) + '...' : ''}
            </p>
          </div>

          {/* Volume Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-[#D4D4D4]">Simulated Batch Count</label>
            <div className="grid grid-cols-5 gap-1">
              {[10, 50, 100, 500, 1000].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSimCount(num)}
                  className={`py-1.5 text-[11px] font-mono font-medium rounded border transition-colors ${
                    simCount === num
                      ? 'bg-[#1F1F1F] text-[#B8F36B] border-[#383838]'
                      : 'bg-[#0D0D0D] text-[#737373] border-[#1F1F1F] hover:text-[#F5F5F5]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Evaluator Engine Indicator */}
          <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F] space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[#929292]">
              <span>Evaluator Engine:</span>
              <span className="font-mono text-[#B8F36B] font-semibold">Sarvam AI (105B)</span>
            </div>
            <div className="flex justify-between text-[#929292]">
              <span>Latency SLA Ceiling:</span>
              <span className="font-mono text-[#F5F5F5]">{selectedAgent?.latencyTargetMs || 850}ms</span>
            </div>
            <div className="flex justify-between text-[#929292]">
              <span>Baseline Quality:</span>
              <span className="font-mono text-[#F5F5F5]">{selectedAgent?.qualityScore || 92.4}%</span>
            </div>
          </div>
        </div>

        {/* Center / Main Panel: Adversarial Scenarios Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-[#141414] p-4 rounded-lg border border-[#262626] space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2.5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#929292]">
                Adversarial Scenario Vectors
              </h2>
              <p className="text-[10px] text-[#5A5A5A] mt-0.5">
                {selectedScenarios.length} of {SCENARIOS.length} scenarios selected for evaluation
              </p>
            </div>
            <button
              onClick={() => setSelectedScenarios(SCENARIOS.map(s => s.id))}
              className="text-[10px] font-mono text-[#929292] hover:text-[#F5F5F5]"
            >
              Select All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SCENARIOS.map((sc) => {
              const isSelected = selectedScenarios.includes(sc.id);
              return (
                <div
                  key={sc.id}
                  onClick={() => toggleScenario(sc.id)}
                  className={`p-2.5 rounded border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#383838]'
                      : 'bg-[#0D0D0D] border-[#1F1F1F] text-[#737373] hover:border-[#2B2B2B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                        isSelected ? 'bg-[#B8F36B] border-[#B8F36B]' : 'border-[#383838]'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-[#090909] stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? 'text-[#F5F5F5]' : 'text-[#737373]'}`}>
                        {sc.label}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#5A5A5A] uppercase">{sc.tag}</span>
                  </div>
                  <p className="text-[10px] text-[#737373] mt-1 pl-5.5 leading-tight">
                    {sc.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Animated Progress Bar if Running */}
      {isSimulating && (
        <div className="bg-[#141414] p-4 rounded-lg border border-[#383838] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#B8F36B] animate-pulse"></span>
              <span className="font-mono text-[#F5F5F5]">{currentScenarioName}</span>
            </div>
            <span className="font-mono font-bold text-[#B8F36B]">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B8F36B] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="font-mono text-[10px] text-[#5A5A5A] space-y-0.5">
            {streamingLog.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Summary & Results */}
      {activeSimulationResult && (
        <div className="bg-[#141414] rounded-lg border border-[#262626] overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F1F1F] pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-[#F5F5F5]">
                  {activeSimulationResult.name}
                </span>
                <span className="text-[10px] font-mono text-[#B8F36B] bg-[#1E2F13] px-1.5 py-0.2 rounded border border-[#B8F36B]/20">
                  {activeSimulationResult.evaluatedBy || 'Sarvam AI (sarvam-105b)'}
                </span>
              </div>
              <p className="text-[10px] text-[#737373] mt-0.5">
                Completed at {new Date(activeSimulationResult.createdAt).toLocaleTimeString()} • {activeSimulationResult.totalSimulations} conversations executed
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-xs font-mono">
                <div>
                  <span className="text-[#5A5A5A]">Score: </span>
                  <span className="text-[#B8F36B] font-bold">{activeSimulationResult.overallScore}%</span>
                </div>
                <div>
                  <span className="text-[#5A5A5A]">Passed: </span>
                  <span className="text-[#F5F5F5]">{activeSimulationResult.passedCount}</span>
                </div>
                <div>
                  <span className="text-[#5A5A5A]">Failed: </span>
                  <span className="text-[#F87171]">{activeSimulationResult.failedCount}</span>
                </div>
              </div>

              <button
                onClick={handleStartSimulation}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] text-[11px] text-[#D4D4D4] transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-[#929292]" />
                <span>Re-run</span>
              </button>
            </div>
          </div>

          {/* Scenario-wise Audit Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0D0D] text-[#5A5A5A] font-mono uppercase text-[9px] border-b border-[#1F1F1F]">
                <tr>
                  <th className="py-2 px-3">Scenario</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Quality</th>
                  <th className="py-2 px-3">Detected Issue</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3 text-right">Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {(activeSimulationResult.results || []).map((res, idx) => {
                  const isPass = res.status === 'Passed';
                  const isFail = res.status === 'Failed';

                  return (
                    <tr
                      key={idx}
                      onClick={() => onSelectConversation({ id: res.conversationId })}
                      className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3 font-medium text-[#F5F5F5]">
                        {res.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-[#737373]">
                        {res.category}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isPass ? 'bg-[#B8F36B]' : isFail ? 'bg-[#F87171]' : 'bg-[#EAB66A]'
                          }`} />
                          <span className="text-[10px] font-mono text-[#929292]">{res.status}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-[#F5F5F5]">
                        {res.score}%
                      </td>
                      <td className="py-2.5 px-3 text-[#929292] max-w-sm truncate text-[11px]">
                        {res.detectedIssue}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                          res.severity === 'Critical'
                            ? 'bg-[#3B1818] text-[#F87171]'
                            : res.severity === 'High'
                            ? 'bg-[#3B2D18] text-[#EAB66A]'
                            : 'bg-[#1F1F1F] text-[#737373]'
                        }`}>
                          {res.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectConversation({ id: res.conversationId });
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
      )}
    </div>
  );
}
