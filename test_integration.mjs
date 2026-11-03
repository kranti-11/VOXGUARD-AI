// VoxGuard AI End-to-End System & Integration Test Suite

const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('====================================================');
  console.log('  VOXGUARD AI — AUTOMATED VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('PASSED');
      passed++;
    } catch (err) {
      console.log('FAILED');
      console.error('  Error:', err.message);
      failed++;
    }
  }

  // Test 1: Health Endpoint
  await test('GET /api/health (Database & Server Status)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok' || data.database !== 'sqlite-connected') {
      throw new Error(`Unexpected health response: ${JSON.stringify(data)}`);
    }
  });

  // Test 2: Agents Endpoint
  await test('GET /api/agents (Load 5 production agents from SQLite)', async () => {
    const res = await fetch(`${BASE_URL}/api/agents`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const agents = await res.json();
    if (!Array.isArray(agents) || agents.length < 5) {
      throw new Error(`Expected at least 5 agents, got ${agents.length}`);
    }
  });

  // Test 3: Conversations from SQLite
  await test('GET /api/conversations (Retrieve persisted conversations)', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const convs = await res.json();
    if (!Array.isArray(convs) || convs.length === 0) {
      throw new Error(`Expected conversations, got empty`);
    }
  });

  // Test 4: Single Conversation by ID
  await test('GET /api/conversations/conv_8912_bank', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/conv_8912_bank`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const conv = await res.json();
    if (conv.id !== 'conv_8912_bank' || !conv.transcript) {
      throw new Error(`Invalid conversation returned: ${conv.id}`);
    }
  });

  // Test 5: Live Sarvam AI Evaluation
  await test('POST /api/evaluations/run (Live Sarvam AI Evaluation on conv_8912_bank)', async () => {
    const res = await fetch(`${BASE_URL}/api/evaluations/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: 'conv_8912_bank' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const evalResult = await res.json();
    if (!evalResult.scores || typeof evalResult.scores.overall !== 'number') {
      throw new Error('Missing scores in evaluation result');
    }
    if (evalResult.status !== 'Failed') {
      throw new Error(`Expected Failed status on policy violation, got: ${evalResult.status}`);
    }
    if (!evalResult.evaluatedBy) {
      throw new Error('Missing evaluatedBy provider tag');
    }
    console.log(`\n    [AI Score: ${evalResult.scores.overall}%, Status: ${evalResult.status}, Evaluator: ${evalResult.evaluatedBy}]`);
  });

  // Test 6: Overview Analytics connected to real data
  await test('GET /api/analytics/overview (Dynamic calculations from SQLite)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/overview`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.metrics || typeof data.metrics.avgQualityScore !== 'number') {
      throw new Error('Invalid analytics response');
    }
    if (data.metrics.totalConversations < 15) {
      throw new Error(`Expected >= 15 conversations, got ${data.metrics.totalConversations}`);
    }
  });

  // Test 7: Adversarial Simulation Suite Execution
  await test('POST /api/simulations/run (Execute simulation batch of 10 calls)', async () => {
    const res = await fetch(`${BASE_URL}/api/simulations/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: 'agent_banking_01',
        count: 10,
        scenarios: ['Angry Customer', 'Policy Violations']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const sim = await res.json();
    if (!sim.id || !Array.isArray(sim.results) || sim.results.length === 0) {
      throw new Error('Invalid simulation result object');
    }
    console.log(`\n    [Simulation ${sim.id}: ${sim.totalSimulations} calls, Pass: ${sim.passedCount}, Fail: ${sim.failedCount}]`);
  });

  // Test 8: Verify Simulation Persisted in SQLite
  await test('GET /api/simulations (Verify newly run simulation saved to SQLite)', async () => {
    const res = await fetch(`${BASE_URL}/api/simulations`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const sims = await res.json();
    if (sims.length === 0) throw new Error('No simulations found');
  });

  // Test 9: Human QA Review Workflow
  await test('POST /api/qa/review (Adjudicate flagged conversation)', async () => {
    const reviewsRes = await fetch(`${BASE_URL}/api/qa/reviews`);
    const reviews = await reviewsRes.json();
    const item = reviews[0];

    const res = await fetch(`${BASE_URL}/api/qa/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewId: item.id,
        verdict: 'Valid Issue',
        comments: 'Confirmed critical 2FA bypass under live audit.',
        adjustedScore: 50,
        reviewer: 'Sarah Chen, QA Lead'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    if (updated.reviewStatus !== 'Reviewed' || updated.verdict !== 'Valid Issue') {
      throw new Error('Failed to update QA review item');
    }
  });

  // Test 10: Regression Testing Release Gate
  await test('POST /api/regression/run (Execute release gate comparison)', async () => {
    const res = await fetch(`${BASE_URL}/api/regression/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: 'agent_banking_01',
        targetVersion: 'v2.5.0-rc2'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const reg = await res.json();
    if (reg.status !== 'Gate Passed' || !reg.scoreDelta) {
      throw new Error('Invalid regression test response');
    }
  });

  // Test 11: Live Telephony Event Simulation
  await test('POST /api/monitoring/simulate (Simulate live incoming call packet)', async () => {
    const res = await fetch(`${BASE_URL}/api/monitoring/simulate`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const call = await res.json();
    if (!call.callId || call.status !== 'Healthy') {
      throw new Error('Invalid simulated call response');
    }
  });

  // Test 12: Settings persistence
  await test('POST & GET /api/settings (Update and retrieve preferences)', async () => {
    const getRes = await fetch(`${BASE_URL}/api/settings`);
    const current = await getRes.json();

    const postRes = await fetch(`${BASE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...current,
        latencyThresholdMs: 1150
      })
    });
    if (!postRes.ok) throw new Error(`POST HTTP ${postRes.status}`);

    const verifyRes = await fetch(`${BASE_URL}/api/settings`);
    const verified = await verifyRes.json();
    if (verified.latencyThresholdMs !== 1150) {
      throw new Error(`Expected latency threshold 1150, got ${verified.latencyThresholdMs}`);
    }
  });

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

