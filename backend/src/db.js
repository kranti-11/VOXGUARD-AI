import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_AGENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_SIMULATIONS,
  INITIAL_REGRESSION_SUITES,
  INITIAL_QA_REVIEWS,
  INITIAL_AI_INSIGHTS,
  INITIAL_MONITORING_EVENTS
} from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'voxguard.db');
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      version TEXT NOT NULL,
      deployed_at TEXT,
      environment TEXT,
      system_prompt_snippet TEXT,
      latency_target_ms INTEGER,
      quality_score REAL,
      total_calls INTEGER,
      active_alerts INTEGER,
      avatar TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      agent_type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      duration_seconds INTEGER,
      avg_latency_ms INTEGER,
      sentiment TEXT,
      status TEXT,
      customer_intent TEXT,
      detected_issue TEXT,
      severity TEXT,
      failure_category TEXT,
      recommendation TEXT,
      audio_duration TEXT,
      evaluated_by TEXT,
      is_ai_evaluated INTEGER DEFAULT 0,
      evaluation_summary TEXT,
      evidence TEXT,
      scores_json TEXT,
      transcript_json TEXT
    );

    CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      agent_type TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      total_simulations INTEGER,
      passed_count INTEGER,
      failed_count INTEGER,
      warning_count INTEGER,
      overall_score REAL,
      scenarios_json TEXT,
      critical_failures INTEGER,
      most_common_failure TEXT,
      evaluated_by TEXT,
      results_json TEXT
    );

    CREATE TABLE IF NOT EXISTS qa_reviews (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      failure_category TEXT,
      detected_issue TEXT,
      ai_confidence REAL,
      severity TEXT,
      review_status TEXT,
      reviewer TEXT,
      reviewed_at TEXT,
      verdict TEXT,
      comments TEXT,
      adjusted_score REAL
    );

    CREATE TABLE IF NOT EXISTS regression_suites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      previous_version TEXT,
      new_version TEXT,
      run_date TEXT,
      previous_score REAL,
      new_score REAL,
      score_delta TEXT,
      status TEXT,
      total_tests INTEGER,
      resolved_count INTEGER,
      regressions_count INTEGER,
      resolved_json TEXT,
      regressions_json TEXT
    );

    CREATE TABLE IF NOT EXISTS ai_insights (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      title TEXT NOT NULL,
      priority TEXT,
      category TEXT,
      impact_score TEXT,
      summary TEXT,
      actionable_steps_json TEXT,
      suggested_prompt_patch TEXT
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Pre-seed agents if empty
  const agentCount = db.prepare('SELECT count(*) as count FROM agents').get().count;
  if (agentCount === 0) {
    console.log('[SQLite DB] Seeding initial agents...');
    const insertAgent = db.prepare(`
      INSERT INTO agents (id, name, type, version, deployed_at, environment, system_prompt_snippet, latency_target_ms, quality_score, total_calls, active_alerts, avatar, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of INITIAL_AGENTS) {
      insertAgent.run(a.id, a.name, a.type, a.version, a.deployedAt, a.environment, a.systemPromptSnippet, a.latencyTargetMs, a.qualityScore, a.totalCalls, a.activeAlerts, a.avatar, a.color);
    }
  }

  // Pre-seed conversations if empty
  const convCount = db.prepare('SELECT count(*) as count FROM conversations').get().count;
  if (convCount === 0) {
    console.log('[SQLite DB] Seeding initial conversations...');
    const insertConv = db.prepare(`
      INSERT INTO conversations (id, agent_id, agent_name, agent_type, timestamp, duration_seconds, avg_latency_ms, sentiment, status, customer_intent, detected_issue, severity, failure_category, recommendation, audio_duration, evaluated_by, is_ai_evaluated, evaluation_summary, evidence, scores_json, transcript_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of INITIAL_CONVERSATIONS) {
      insertConv.run(
        c.id, c.agentId, c.agentName, c.agentType, c.timestamp, c.durationSeconds,
        c.avgLatencyMs, c.sentiment, c.status, c.customerIntent, c.detectedIssue,
        c.severity, c.failureCategory, c.recommendation, c.audioDuration,
        c.evaluatedBy || "Pre-deployment Baseline", c.isAiEvaluated ? 1 : 0,
        c.evaluationSummary || c.recommendation, c.evidence || "",
        JSON.stringify(c.scores || {}), JSON.stringify(c.transcript || [])
      );
    }
  }

  // Pre-seed simulations if empty
  const simCount = db.prepare('SELECT count(*) as count FROM simulations').get().count;
  if (simCount === 0) {
    console.log('[SQLite DB] Seeding initial simulations...');
    const insertSim = db.prepare(`
      INSERT INTO simulations (id, name, agent_id, agent_name, agent_type, created_at, status, total_simulations, passed_count, failed_count, warning_count, overall_score, scenarios_json, critical_failures, most_common_failure, evaluated_by, results_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of INITIAL_SIMULATIONS) {
      insertSim.run(
        s.id, s.name, s.agentId, s.agentName, s.agentType, s.createdAt, s.status,
        s.totalSimulations, s.passedCount, s.failedCount, s.warningCount, s.overallScore,
        JSON.stringify(s.scenariosSelected || []), s.criticalFailures, s.mostCommonFailure,
        s.evaluatedBy || "Sarvam AI (sarvam-105b-conversations)", JSON.stringify(s.results || [])
      );
    }
  }

  // Pre-seed QA reviews if empty
  const qaCount = db.prepare('SELECT count(*) as count FROM qa_reviews').get().count;
  if (qaCount === 0) {
    console.log('[SQLite DB] Seeding initial QA reviews...');
    const insertQA = db.prepare(`
      INSERT INTO qa_reviews (id, conversation_id, agent_name, failure_category, detected_issue, ai_confidence, severity, review_status, reviewer, reviewed_at, verdict, comments, adjusted_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const q of INITIAL_QA_REVIEWS) {
      insertQA.run(
        q.id, q.conversationId, q.agentName, q.failureCategory, q.detectedIssue,
        q.aiConfidence, q.severity, q.reviewStatus, q.reviewer, q.reviewedAt,
        q.verdict, q.comments, q.adjustedScore
      );
    }
  }

  // Pre-seed regression suites if empty
  const regCount = db.prepare('SELECT count(*) as count FROM regression_suites').get().count;
  if (regCount === 0) {
    console.log('[SQLite DB] Seeding initial regression suites...');
    const insertReg = db.prepare(`
      INSERT INTO regression_suites (id, name, agent_id, agent_name, previous_version, new_version, run_date, previous_score, new_score, score_delta, status, total_tests, resolved_count, regressions_count, resolved_json, regressions_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of INITIAL_REGRESSION_SUITES) {
      insertReg.run(
        r.id, r.name, r.agentId, r.agentName, r.previousVersion, r.newVersion, r.runDate,
        r.previousScore, r.newScore, r.scoreDelta, r.status, r.totalTests,
        r.resolvedIssuesCount, r.newlyIntroducedFailuresCount,
        JSON.stringify(r.resolvedIssues || []), JSON.stringify(r.regressionAlerts || [])
      );
    }
  }

  // Pre-seed insights if empty
  const insCount = db.prepare('SELECT count(*) as count FROM ai_insights').get().count;
  if (insCount === 0) {
    console.log('[SQLite DB] Seeding initial AI insights...');
    const insertIns = db.prepare(`
      INSERT INTO ai_insights (id, agent_id, agent_name, title, priority, category, impact_score, summary, actionable_steps_json, suggested_prompt_patch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const i of INITIAL_AI_INSIGHTS) {
      insertIns.run(
        i.id, i.agentId, i.agentName, i.title, i.priority, i.category, i.impactScore,
        i.summary, JSON.stringify(i.actionableSteps || []), i.suggestedPromptPatch
      );
    }
  }

  console.log('[SQLite DB] Initialized & persistent at', DB_PATH);
}

// Data Access Object (DAO) Functions
export const DB = {
  // Agents
  getAgents() {
    return db.prepare('SELECT * FROM agents ORDER BY name ASC').all();
  },
  getAgentById(id) {
    return db.prepare('SELECT * FROM agents WHERE id = ?').get(id);
  },

  // Conversations
  getConversations(filter = {}) {
    let query = 'SELECT * FROM conversations WHERE 1=1';
    const params = [];

    if (filter.agentId) {
      query += ' AND agent_id = ?';
      params.push(filter.agentId);
    }
    if (filter.status) {
      query += ' AND lower(status) = lower(?)';
      params.push(filter.status);
    }
    if (filter.severity) {
      query += ' AND lower(severity) = lower(?)';
      params.push(filter.severity);
    }
    if (filter.category) {
      query += ' AND lower(failure_category) = lower(?)';
      params.push(filter.category);
    }

    query += ' ORDER BY timestamp DESC';
    const rows = db.prepare(query).all(...params);
    return rows.map(r => ({
      ...r,
      agentId: r.agent_id,
      agentName: r.agent_name,
      agentType: r.agent_type,
      durationSeconds: r.duration_seconds,
      avgLatencyMs: r.avg_latency_ms,
      customerIntent: r.customer_intent,
      detectedIssue: r.detected_issue,
      failureCategory: r.failure_category,
      audioDuration: r.audio_duration,
      evaluatedBy: r.evaluated_by,
      isAiEvaluated: Boolean(r.is_ai_evaluated),
      evaluationSummary: r.evaluation_summary,
      scores: JSON.parse(r.scores_json || '{}'),
      transcript: JSON.parse(r.transcript_json || '[]')
    }));
  },

  getConversationById(id) {
    const r = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
    if (!r) return null;
    return {
      ...r,
      agentId: r.agent_id,
      agentName: r.agent_name,
      agentType: r.agent_type,
      durationSeconds: r.duration_seconds,
      avgLatencyMs: r.avg_latency_ms,
      customerIntent: r.customer_intent,
      detectedIssue: r.detected_issue,
      failureCategory: r.failure_category,
      audioDuration: r.audio_duration,
      evaluatedBy: r.evaluated_by,
      isAiEvaluated: Boolean(r.is_ai_evaluated),
      evaluationSummary: r.evaluation_summary,
      scores: JSON.parse(r.scores_json || '{}'),
      transcript: JSON.parse(r.transcript_json || '[]')
    };
  },

  saveConversation(c) {
    const existing = db.prepare('SELECT id FROM conversations WHERE id = ?').get(c.id);
    if (existing) {
      db.prepare(`
        UPDATE conversations SET
          status = ?, detected_issue = ?, severity = ?, failure_category = ?,
          recommendation = ?, evaluated_by = ?, is_ai_evaluated = ?,
          evaluation_summary = ?, evidence = ?, scores_json = ?, transcript_json = ?
        WHERE id = ?
      `).run(
        c.status, c.detectedIssue, c.severity, c.failureCategory,
        c.recommendation, c.evaluatedBy, c.isAiEvaluated ? 1 : 0,
        c.evaluationSummary, c.evidence || "",
        JSON.stringify(c.scores || {}), JSON.stringify(c.transcript || []),
        c.id
      );
    } else {
      db.prepare(`
        INSERT INTO conversations (
          id, agent_id, agent_name, agent_type, timestamp, duration_seconds,
          avg_latency_ms, sentiment, status, customer_intent, detected_issue,
          severity, failure_category, recommendation, audio_duration, evaluated_by,
          is_ai_evaluated, evaluation_summary, evidence, scores_json, transcript_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        c.id, c.agentId, c.agentName, c.agentType, c.timestamp || new Date().toISOString(),
        c.durationSeconds || 120, c.avgLatencyMs || 850, c.sentiment || "Neutral",
        c.status, c.customerIntent, c.detectedIssue, c.severity, c.failureCategory,
        c.recommendation, c.audioDuration || "2m 10s", c.evaluatedBy || "Sarvam AI (sarvam-105b)",
        c.isAiEvaluated ? 1 : 0, c.evaluationSummary || "", c.evidence || "",
        JSON.stringify(c.scores || {}), JSON.stringify(c.transcript || [])
      );
    }
    return this.getConversationById(c.id);
  },

  // Simulations
  getSimulations() {
    const rows = db.prepare('SELECT * FROM simulations ORDER BY created_at DESC').all();
    return rows.map(r => ({
      ...r,
      agentId: r.agent_id,
      agentName: r.agent_name,
      agentType: r.agent_type,
      createdAt: r.created_at,
      totalSimulations: r.total_simulations,
      passedCount: r.passed_count,
      failedCount: r.failed_count,
      warningCount: r.warning_count,
      overallScore: r.overall_score,
      criticalFailures: r.critical_failures,
      mostCommonFailure: r.most_common_failure,
      evaluatedBy: r.evaluated_by,
      scenariosSelected: JSON.parse(r.scenarios_json || '[]'),
      results: JSON.parse(r.results_json || '[]')
    }));
  },

  saveSimulation(s) {
    db.prepare(`
      INSERT INTO simulations (
        id, name, agent_id, agent_name, agent_type, created_at, status,
        total_simulations, passed_count, failed_count, warning_count,
        overall_score, scenarios_json, critical_failures, most_common_failure,
        evaluated_by, results_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      s.id, s.name, s.agentId, s.agentName, s.agentType, s.createdAt || new Date().toISOString(),
      s.status || "Completed", s.totalSimulations, s.passedCount, s.failedCount,
      s.warningCount, s.overallScore, JSON.stringify(s.scenariosSelected || []),
      s.criticalFailures || 0, s.mostCommonFailure || "None", s.evaluatedBy || "Sarvam AI",
      JSON.stringify(s.results || [])
    );
  },

  // QA Reviews
  getQAReviews() {
    const rows = db.prepare('SELECT * FROM qa_reviews ORDER BY reviewed_at DESC').all();
    return rows.map(r => ({
      ...r,
      conversationId: r.conversation_id,
      agentName: r.agent_name,
      failureCategory: r.failure_category,
      detectedIssue: r.detected_issue,
      aiConfidence: r.ai_confidence,
      reviewStatus: r.review_status,
      reviewedAt: r.reviewed_at,
      adjustedScore: r.adjusted_score
    }));
  },

  updateQAReview(review) {
    db.prepare(`
      UPDATE qa_reviews SET
        review_status = ?, verdict = ?, comments = ?, reviewer = ?,
        reviewed_at = ?, adjusted_score = ?
      WHERE id = ?
    `).run(
      review.reviewStatus, review.verdict, review.comments, review.reviewer,
      review.reviewedAt || new Date().toISOString(), review.adjustedScore, review.id
    );
    const updated = db.prepare('SELECT * FROM qa_reviews WHERE id = ?').get(review.id);
    return {
      ...updated,
      conversationId: updated.conversation_id,
      agentName: updated.agent_name,
      failureCategory: updated.failure_category,
      detectedIssue: updated.detected_issue,
      aiConfidence: updated.ai_confidence,
      reviewStatus: updated.review_status,
      reviewedAt: updated.reviewed_at,
      adjustedScore: updated.adjusted_score
    };
  },

  // Regression Suites
  getRegressionSuites() {
    const rows = db.prepare('SELECT * FROM regression_suites ORDER BY run_date DESC').all();
    return rows.map(r => ({
      ...r,
      agentId: r.agent_id,
      agentName: r.agent_name,
      previousVersion: r.previous_version,
      newVersion: r.new_version,
      runDate: r.run_date,
      previousScore: r.previous_score,
      newScore: r.new_score,
      scoreDelta: r.score_delta,
      totalTests: r.total_tests,
      resolvedIssuesCount: r.resolved_count,
      newlyIntroducedFailuresCount: r.regressions_count,
      resolvedIssues: JSON.parse(r.resolved_json || '[]'),
      regressionAlerts: JSON.parse(r.regressions_json || '[]')
    }));
  },

  saveRegressionSuite(r) {
    db.prepare(`
      INSERT INTO regression_suites (
        id, name, agent_id, agent_name, previous_version, new_version, run_date,
        previous_score, new_score, score_delta, status, total_tests,
        resolved_count, regressions_count, resolved_json, regressions_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      r.id, r.name, r.agentId, r.agentName, r.previousVersion, r.newVersion,
      r.runDate || new Date().toISOString(), r.previousScore, r.newScore,
      r.scoreDelta, r.status, r.totalTests, r.resolvedIssuesCount,
      r.newlyIntroducedFailuresCount, JSON.stringify(r.resolvedIssues || []),
      JSON.stringify(r.regressionAlerts || [])
    );
  },

  // AI Insights
  getAIInsights() {
    const rows = db.prepare('SELECT * FROM ai_insights ORDER BY id DESC').all();
    return rows.map(r => ({
      ...r,
      agentId: r.agent_id,
      agentName: r.agent_name,
      impactScore: r.impact_score,
      actionableSteps: JSON.parse(r.actionable_steps_json || '[]'),
      suggestedPromptPatch: r.suggested_prompt_patch
    }));
  },

  saveAIInsight(ins) {
    db.prepare(`
      INSERT INTO ai_insights (
        id, agent_id, agent_name, title, priority, category, impact_score,
        summary, actionable_steps_json, suggested_prompt_patch
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ins.id, ins.agentId, ins.agentName, ins.title, ins.priority, ins.category,
      ins.impactScore, ins.summary, JSON.stringify(ins.actionableSteps || []),
      ins.suggestedPromptPatch
    );
  },

  // Settings
  getSetting(key, defaultValue = null) {
    const row = db.prepare('SELECT value FROM system_settings WHERE key = ?').get(key);
    return row ? JSON.parse(row.value) : defaultValue;
  },

  setSetting(key, value) {
    db.prepare(`
      INSERT INTO system_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, JSON.stringify(value));
  }
};

