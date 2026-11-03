import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Square,
  AlertOctagon,
  Clock,
  Sparkles,
  UserCheck,
  Bot,
  User,
  RotateCcw,
  Check,
  Cpu
} from 'lucide-react';
import { playConversationAudio, stopSpeech } from '../utils/speech';

export const WEIGHT_CONFIG = [
  { key: 'intentUnderstanding', label: 'Intent Understanding', weight: 0.20 },
  { key: 'responseAccuracy', label: 'Response Accuracy', weight: 0.25 },
  { key: 'policyCompliance', label: 'Policy Compliance', weight: 0.20 },
  { key: 'resolutionEffectiveness', label: 'Resolution Effectiveness', weight: 0.15 },
  { key: 'conversationQuality', label: 'Conversation Quality', weight: 0.10 },
  { key: 'responseLatency', label: 'Response Latency', weight: 0.10 },
];

export default function TranscriptDrawer({ conversation, onClose, onSendToReview, onConversationUpdated }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState(null);
  const [speechController, setSpeechController] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentConv, setCurrentConv] = useState(conversation);

  useEffect(() => {
    setCurrentConv(conversation);
  }, [conversation]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!currentConv) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (speechController) speechController.stop();
      stopSpeech();
      setIsPlaying(false);
      setActiveTurnIndex(null);
    } else {
      setIsPlaying(true);
      const controller = playConversationAudio(
        currentConv.transcript || [],
        (index) => {
          setActiveTurnIndex(index);
        },
        () => {
          setIsPlaying(false);
          setActiveTurnIndex(null);
        }
      );
      setSpeechController(controller);
    }
  };

  const handleRunSarvamEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: currentConv.id })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentConv(updated);
        if (onConversationUpdated) onConversationUpdated(updated);
      }
    } catch (err) {
      console.error('Failed to trigger Sarvam evaluation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const scores = currentConv.scores || {
    intentUnderstanding: 85,
    responseAccuracy: 80,
    policyCompliance: 75,
    resolutionEffectiveness: 70,
    conversationQuality: 80,
    responseLatency: 80,
    overall: 78.5
  };

  const isAiEvaluated = currentConv.isAiEvaluated || (currentConv.evaluatedBy && currentConv.evaluatedBy.includes('Sarvam'));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-[2px]">
      {/* Background click */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="w-full max-w-2xl bg-[#0D0D0D] border-l border-[#262626] h-full flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-[#262626] bg-[#141414] flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-[#F5F5F5] bg-[#1F1F1F] px-2 py-0.5 rounded border border-[#333333]">
                {currentConv.id}
              </span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                currentConv.status === 'Passed'
                  ? 'bg-[#1E2F13] text-[#B8F36B]'
                  : currentConv.status === 'Warning'
                  ? 'bg-[#3B2D18] text-[#EAB66A]'
                  : 'bg-[#3B1818] text-[#F87171]'
              }`}>
                {currentConv.status}
              </span>
              <span className="text-[11px] font-mono text-[#5A5A5A]">
                {currentConv.durationSeconds || 140}s • Latency {currentConv.avgLatencyMs || 820}ms
              </span>
            </div>

            <h2 className="text-sm font-semibold text-[#F5F5F5] pt-0.5">
              {currentConv.agentName}
            </h2>
            <p className="text-xs text-[#929292]">
              Intent: {currentConv.customerIntent}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isPlaying
                  ? 'bg-[#F87171] text-[#090909] font-bold'
                  : 'bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909]'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-[#737373] hover:text-[#F5F5F5] hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Powered by Sarvam AI Header Tag & Trigger */}
          <div className="flex items-center justify-between p-2.5 rounded bg-[#141414] border border-[#262626]">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isAiEvaluated ? 'bg-[#B8F36B]' : 'bg-[#EAB66A]'}`} />
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-mono font-medium text-[#F5F5F5]">
                  {currentConv.evaluatedBy || 'Sarvam AI (sarvam-105b)'}
                </span>
                <span className="text-[10px] text-[#5A5A5A]">• Powered by Sarvam AI</span>
              </div>
            </div>

            <button
              onClick={handleRunSarvamEvaluation}
              disabled={isEvaluating}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                isEvaluating
                  ? 'bg-[#1F1F1F] text-[#5A5A5A] border-[#2B2B2B] cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-[#222222] text-[#B8F36B] border-[#383838]'
              }`}
            >
              <RotateCcw className={`w-3 h-3 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? 'Evaluating with Sarvam...' : 'Re-evaluate with Sarvam AI'}</span>
            </button>
          </div>

          {/* AI Executive Summary if available */}
          {currentConv.evaluationSummary && (
            <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F] space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#737373] block">
                Evaluator Summary & Diagnosis
              </span>
              <p className="text-xs text-[#D4D4D4] leading-relaxed">
                {currentConv.evaluationSummary}
              </p>
            </div>
          )}

          {/* Detected Issue Banner */}
          {currentConv.detectedIssue && currentConv.detectedIssue !== 'None' && (
            <div className="p-3 rounded bg-[#141414] border border-[#F87171]/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#F87171] font-bold">
                  {currentConv.failureCategory} • {currentConv.severity} Severity
                </span>
              </div>
              <p className="text-xs font-medium text-[#F5F5F5]">
                {currentConv.detectedIssue}
              </p>
              {currentConv.evidence && (
                <div className="text-[11px] text-[#A1A1AA] pt-1 border-t border-[#1F1F1F] font-mono">
                  <span className="text-[#F87171] font-semibold">Evidence:</span> "{currentConv.evidence}"
                </div>
              )}
              {currentConv.recommendation && (
                <p className="text-[11px] text-[#929292] pt-1 border-t border-[#1F1F1F]">
                  <span className="text-[#B8F36B] font-medium">Recommended Correction:</span> {currentConv.recommendation}
                </p>
              )}
            </div>
          )}

          {/* Multidimensional Scorecard */}
          <div className="bg-[#141414] rounded-lg border border-[#262626] p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2">
              <div>
                <span className="text-xs font-semibold text-[#F5F5F5]">Multidimensional QA Scorecard</span>
                <span className="text-[10px] text-[#5A5A5A] block">6-dimension weighted rubric</span>
              </div>
              <span className="text-sm font-bold font-mono text-[#F5F5F5]">
                {scores.overall?.toFixed(1) || '85.0'}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {WEIGHT_CONFIG.map((dim) => {
                const val = scores[dim.key] ?? 80;
                return (
                  <div key={dim.key} className="bg-[#0D0D0D] p-2 rounded border border-[#1F1F1F] space-y-1">
                    <div className="flex justify-between text-[10px] text-[#929292]">
                      <span className="truncate">{dim.label}</span>
                      <span className="font-mono text-[#F5F5F5]">{val}</span>
                    </div>
                    <div className="w-full h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B8F36B] rounded-full"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Turn-by-Turn Transcript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#929292]">
              <span className="font-semibold text-[#F5F5F5]">Synchronized Transcript</span>
              <span className="font-mono text-[10px]">{(currentConv.transcript || []).length} turns</span>
            </div>

            <div className="space-y-2">
              {(currentConv.transcript || []).map((turn, index) => {
                const isAgent = turn.speaker === 'agent';
                const isActive = activeTurnIndex === index;
                const hasTurnIssue = turn.hasIssue;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded border transition-colors ${
                      isActive
                        ? 'bg-[#1A1A1A] border-[#B8F36B]'
                        : hasTurnIssue
                        ? 'bg-[#141414] border-[#F87171]/40'
                        : 'bg-[#141414] border-[#1F1F1F]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1 py-0.2 rounded font-bold ${
                          isAgent ? 'bg-[#1F1F1F] text-[#B8F36B]' : 'bg-[#1F1F1F] text-[#929292]'
                        }`}>
                          {isAgent ? 'AGENT' : 'CALLER'}
                        </span>
                        <span className="text-[#5A5A5A]">{turn.timestamp}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-[#737373]">
                        {turn.latencyMs > 0 && <span>{turn.latencyMs}ms</span>}
                        <span>{turn.sentiment}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#E5E5E5] leading-relaxed">
                      {turn.text}
                    </p>

                    {hasTurnIssue && (
                      <div className="mt-2 p-2 rounded bg-[#3B1818]/60 border border-[#F87171]/30 text-[11px] text-[#F87171] font-mono">
                        <span className="font-bold">VIOLATION: </span>{turn.issueDetail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#262626] bg-[#141414] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#5A5A5A]">ID: {currentConv.id}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (onSendToReview) onSendToReview(currentConv);
                onClose();
              }}
              className="px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#202020] border border-[#262626] text-xs font-medium text-[#D4D4D4] transition-colors"
            >
              Flag to Review
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-[#F5F5F5] hover:bg-white text-[#090909] text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
