import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Sliders,
  Volume2,
  Check,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    sarvamApiKeySet: false,
    sarvamModel: 'sarvam-105b-conversations',
    latencyThresholdMs: 1200,
    vadSilenceThresholdMs: 300,
    enableSpeechSynthesis: true,
    environment: 'Demo Sandbox'
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#F5F5F5]">
            Settings
          </h1>
          <p className="text-xs text-[#929292] mt-0.5">
            System parameters, Sarvam AI SDK integration, and telemetry thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#B8F36B] hover:bg-[#A3E635] text-[#090909] text-xs font-semibold transition-colors"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Sarvam AI Section */}
        <div className="bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <div>
              <h2 className="text-xs font-semibold text-[#F5F5F5]">Sarvam AI Integration</h2>
              <p className="text-[10px] text-[#737373]">sarvamai Python SDK v0.1.43 • sarvam-105b-conversations</p>
            </div>

            <div>
              {settings.sarvamApiKeySet ? (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-[#B8F36B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8F36B]" />
                  <span>KEY DETECTED</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-[#EAB66A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAB66A]" />
                  <span>KEY NOT SET IN .ENV</span>
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#929292] leading-relaxed">
            API key is read securely from your project's <code className="text-[#F5F5F5] font-mono">.env</code> file (which is git-ignored).
            The standalone test script <code className="text-[#B8F36B] font-mono">sarvam_test.py</code> is ready to execute with your key.
          </p>

          <div className="bg-[#0D0D0D] p-3 rounded border border-[#1F1F1F] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-[#737373]">
              <span>Model ID:</span>
              <span className="text-[#F5F5F5]">{settings.sarvamModel}</span>
            </div>
            <div className="flex justify-between text-[#737373]">
              <span>Path:</span>
              <span className="text-[#929292]">/Users/kranti/Desktop/Sarvam/.env</span>
            </div>
          </div>
        </div>

        {/* Telephony SLA */}
        <div className="bg-[#141414] rounded-lg border border-[#262626] p-4 space-y-3">
          <div className="border-b border-[#1F1F1F] pb-3">
            <h2 className="text-xs font-semibold text-[#F5F5F5]">Voice Telephony SLA & VAD</h2>
            <p className="text-[10px] text-[#737373]">Response time ceilings and turn-taking barge-in thresholds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#929292]">
                <span>Latency Alert Threshold</span>
                <span className="font-mono text-[#F5F5F5] font-bold">{settings.latencyThresholdMs}ms</span>
              </div>
              <input
                type="range"
                min="500"
                max="3000"
                step="50"
                value={settings.latencyThresholdMs}
                onChange={(e) => setSettings({ ...settings, latencyThresholdMs: Number(e.target.value) })}
                className="w-full accent-[#B8F36B]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#929292]">
                <span>VAD Silence Barge-In Sensitivity</span>
                <span className="font-mono text-[#F5F5F5] font-bold">{settings.vadSilenceThresholdMs}ms</span>
              </div>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={settings.vadSilenceThresholdMs}
                onChange={(e) => setSettings({ ...settings, vadSilenceThresholdMs: Number(e.target.value) })}
                className="w-full accent-[#B8F36B]"
              />
            </div>
          </div>
        </div>

        {/* Audio Synthesis */}
        <div className="bg-[#141414] rounded-lg border border-[#262626] p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-[#F5F5F5]">Browser Speech Synthesis</h2>
            <p className="text-[10px] text-[#737373]">Enable speech playback for conversation turn inspection</p>
          </div>

          <button
            type="button"
            onClick={() => setSettings({ ...settings, enableSpeechSynthesis: !settings.enableSpeechSynthesis })}
            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
              settings.enableSpeechSynthesis ? 'bg-[#B8F36B]' : 'bg-[#262626]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#090909] transition-transform ${
                settings.enableSpeechSynthesis ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
