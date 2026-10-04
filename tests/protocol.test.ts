import test from 'node:test';
import assert from 'node:assert/strict';
import type { HCSAnchorResultView, SecurityEvidencePayload } from '../src/types/protocol.ts';
import { mockAnchorEvidence, mockToHCSMessage } from '../src/services/mockHardwareHCS.ts';

test('mockAnchorEvidence returns mode=mock and increasing sequence', () => {
  const a = mockAnchorEvidence({ eventId: 'e1', deviceId: 'd1', severity: 'low', type: 'heartbeat' });
  const b = mockAnchorEvidence({ eventId: 'e2', deviceId: 'd1', severity: 'high', type: 'tamper' });
  assert.equal(a.mode, 'mock');
  assert.equal(b.mode, 'mock');
  assert.ok(b.sequenceNumber > a.sequenceNumber);
  assert.ok(a.evidenceHash.length > 0);
  assert.ok(a.topicId.startsWith('0.0.'));
});

test('mockToHCSMessage maps anchor result to HCSMessage', () => {
  const anchor: HCSAnchorResultView = mockAnchorEvidence({
    eventId: 'e3',
    deviceId: 'SHIELD-NODE-01',
    severity: 'medium',
    type: 'anomaly',
  });
  const msg = mockToHCSMessage(anchor, 'SHIELD-NODE-01', 'HEARTBEAT', 25);
  assert.equal(msg.deviceId, 'SHIELD-NODE-01');
  assert.equal(msg.mode, 'mock');
  assert.equal(msg.sequenceNumber, anchor.sequenceNumber);
  assert.equal(msg.evidenceHash, anchor.evidenceHash);
});

test('SecurityEvidencePayload shape is valid for HCS message size', () => {
  const payload: SecurityEvidencePayload = {
    v: 1,
    eventId: 'evt-001',
    deviceId: 'SHIELD-NODE-01',
    severity: 'critical',
    type: 'tamper',
    hash: 'a'.repeat(64),
    ts: Date.now(),
  };
  const json = JSON.stringify(payload);
  assert.ok(Buffer.byteLength(json, 'utf8') < 1000, 'HCS message must stay under ~1KB');
});
