import test from 'node:test';
import assert from 'node:assert/strict';
import {
  rankThreats,
  suggestActions,
  buildCopilotBriefing,
  type CopilotContext,
} from '../src/core/securityCopilot.ts';

const baseCtx: CopilotContext = {
  activeNodes: 10,
  totalNodes: 12,
  tamperedNodes: 2,
  highSeverityEvents: 3,
  lastAnchorMode: 'mock',
  openEscrows: 1,
};

test('rankThreats prioritizes tamper over low activity', () => {
  const ranked = rankThreats(baseCtx);
  assert.ok(ranked.length >= 1);
  assert.equal(ranked[0].priority, 'critical');
  assert.match(ranked[0].title.toLowerCase(), /tamper|integridad|integrity/i);
});

test('suggestActions includes HCS anchor when live mode available', () => {
  const live = suggestActions({ ...baseCtx, lastAnchorMode: 'live', highSeverityEvents: 1 });
  assert.ok(live.some((a) => a.action === 'anchor_evidence' || a.action === 'review_incident'));
});

test('buildCopilotBriefing is non-empty Spanish operational summary', () => {
  const brief = buildCopilotBriefing(baseCtx);
  assert.ok(brief.length > 40);
  assert.ok(/nodo|alerta|evidencia|HCS|escrow/i.test(brief));
});

test('zero threats yields calm briefing', () => {
  const calm = buildCopilotBriefing({
    activeNodes: 5,
    totalNodes: 5,
    tamperedNodes: 0,
    highSeverityEvents: 0,
    lastAnchorMode: 'live',
    openEscrows: 0,
  });
  assert.ok(/estable|ok|sin alertas|nominal/i.test(calm));
});
