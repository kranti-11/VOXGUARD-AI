import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import TranscriptDrawer from './components/TranscriptDrawer';

import OverviewView from './views/OverviewView';
import SimulationLabView from './views/SimulationLabView';
import LiveMonitoringView from './views/LiveMonitoringView';
import EvaluationsView from './views/EvaluationsView';
import RegressionView from './views/RegressionView';
import HumanReviewView from './views/HumanReviewView';
import AnalyticsView from './views/AnalyticsView';
import AdvisorView from './views/AdvisorView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState('overview');
  const [agents, setAgents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [regressionSuites, setRegressionSuites] = useState([]);
  const [qaReviews, setQaReviews] = useState([]);
  const [insights, setInsights] = useState([]);
  const [monitoringData, setMonitoringData] = useState(null);

  const [selectedAgent, setSelectedAgent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  const refreshOverview = () => {
    fetch('/api/analytics/overview').then(r => r.json()).then(setAnalyticsData).catch(console.error);
  };

  // Fetch initial data
  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(setAgents).catch(console.error);
    fetch('/api/conversations').then(r => r.json()).then(setConversations).catch(console.error);
    refreshOverview();
    fetch('/api/simulations').then(r => r.json()).then(setSimulations).catch(console.error);
    fetch('/api/regression/runs').then(r => r.json()).then(setRegressionSuites).catch(console.error);
    fetch('/api/qa/reviews').then(r => r.json()).then(setQaReviews).catch(console.error);
    fetch('/api/insights').then(r => r.json()).then(setInsights).catch(console.error);
    fetch('/api/monitoring/events').then(r => r.json()).then(setMonitoringData).catch(console.error);
  }, []);

  const handleSelectConversation = (convOrRef) => {
    if (convOrRef.transcript) {
      setSelectedConversation(convOrRef);
    } else {
      const found = conversations.find(c => c.id === convOrRef.id) || conversations[0];
      setSelectedConversation(found);
    }
  };

  const handleConversationUpdated = (updatedConv) => {
    setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));
    setSelectedConversation(updatedConv);
    refreshOverview();
  };

  const handleSendToReview = (conv) => {
    setCurrentView('human-review');
  };

  const handleQuickSimulate = () => {
    setCurrentView('simulations');
  };

  const filteredConversations = conversations.filter(c => {
    if (selectedAgent !== 'all' && c.agentId !== selectedAgent) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchIntent = c.customerIntent.toLowerCase().includes(q);
      const matchAgent = c.agentName.toLowerCase().includes(q);
      const matchIssue = (c.detectedIssue || '').toLowerCase().includes(q);
      if (!matchId && !matchIntent && !matchAgent && !matchIssue) return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090909] text-[#F5F5F5]">
      {/* Fixed Narrow Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeAlertsCount={monitoringData?.activeAlertsCount || 4}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNav
          currentView={currentView}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          agents={agents}
          onQuickSimulate={handleQuickSimulate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeAlerts={monitoringData?.activeCalls?.filter(c => c.status !== 'Healthy') || []}
        />

        {/* View Routed Content */}
        <main className="flex-1 overflow-y-auto bg-[#090909]">
          {currentView === 'overview' && (
            <OverviewView
              analyticsData={analyticsData}
              conversations={filteredConversations}
              onSelectConversation={handleSelectConversation}
              onNavigateToSimulations={() => setCurrentView('simulations')}
            />
          )}

          {currentView === 'simulations' && (
            <SimulationLabView
              agents={agents}
              onSelectConversation={handleSelectConversation}
              simulations={simulations}
              onSimulationComplete={(newSim) => {
                setSimulations(prev => [newSim, ...prev]);
                fetch('/api/conversations').then(r => r.json()).then(setConversations).catch(console.error);
                refreshOverview();
              }}
            />
          )}

          {currentView === 'monitoring' && (
            <LiveMonitoringView
              monitoringData={monitoringData}
              onSelectConversation={handleSelectConversation}
              conversations={conversations}
            />
          )}

          {currentView === 'evaluations' && (
            <EvaluationsView
              conversations={filteredConversations}
              agents={agents}
              onSelectConversation={handleSelectConversation}
            />
          )}

          {currentView === 'regression' && (
            <RegressionView
              regressionSuites={regressionSuites}
              agents={agents}
            />
          )}

          {currentView === 'human-review' && (
            <HumanReviewView
              qaReviews={qaReviews}
              onSelectConversation={handleSelectConversation}
              onReviewSubmit={(updated) => {
                setQaReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
                refreshOverview();
              }}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              agents={agents}
              conversations={filteredConversations}
            />
          )}

          {currentView === 'advisor' && (
            <AdvisorView
              insights={insights}
              agents={agents}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Slide-over Conversation Transcript & Audio Modal */}
      {selectedConversation && (
        <TranscriptDrawer
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
          onSendToReview={handleSendToReview}
          onConversationUpdated={handleConversationUpdated}
        />
      )}
    </div>
  );
}
