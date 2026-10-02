import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySeverity, createEvidenceHash, createSecurityEvent, validateSecurityEvent } from '../src/core/securityEvents.ts';

test('classifies invalid integrity as critical', () => { assert.equal(classifySeverity(0.1, false), 'CRITICAL'); });
test('classifies anomaly scores deterministically', () => {
  assert.equal(classifySeverity(0.95, true), 'HIGH');
  assert.equal(classifySeverity(0.75, true), 'MEDIUM');
  assert.equal(classifySeverity(0.5, true), 'LOW');
  assert.equal(classifySeverity(0.1, true), 'INFO');
});
test('rejects invalid security event input', () => {
  const errors = validateSecurityEvent({ deviceId: '', eventType: '', observedAt: 'not-a-date', integrityValid: true, anomalyScore: 2 });
  assert.equal(errors.length, 4);
});
test('creates stable evidence identifiers', () => {
  const input = { deviceId: 'edge-01', eventType: 'telemetry-anomaly', observedAt: '2026-10-02T12:00:00.000Z', integrityValid: true, anomalyScore: 0.72 };
  assert.equal(createEvidenceHash(input), createEvidenceHash(input));
  assert.equal(createSecurityEvent(input).severity, 'MEDIUM');
});
test('changes evidence when event data changes', () => {
  const base = { deviceId: 'edge-01', eventType: 'telemetry-anomaly', observedAt: '2026-10-02T12:00:00.000Z', integrityValid: true, anomalyScore: 0.72 };
  assert.notEqual(createEvidenceHash(base), createEvidenceHash({ ...base, anomalyScore: 0.73 }));
});