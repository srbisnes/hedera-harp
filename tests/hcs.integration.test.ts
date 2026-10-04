/**
 * HCS integration tests.
 * Runs against Hedera testnet only when HEDERA_OPERATOR_ID and
 * HEDERA_OPERATOR_KEY are set. Otherwise skipped so CI without credentials passes.
 *
 * Usage: npm run test:hcs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';

dotenv.config();

const hasCredentials = Boolean(
  process.env.HEDERA_OPERATOR_ID && process.env.HEDERA_OPERATOR_KEY,
);

test('isHcsConfigured reflects env credentials', async () => {
  const { isHcsConfigured } = await import('../src/services/hederaHCS.ts');
  assert.equal(isHcsConfigured(), hasCredentials);
});

test('getHcsStatus returns network and operator fields', async () => {
  const { getHcsStatus } = await import('../src/services/hederaHCS.ts');
  const status = getHcsStatus();
  assert.ok(['testnet', 'mainnet'].includes(status.network));
  assert.equal(typeof status.configured, 'boolean');
  if (hasCredentials) {
    assert.ok(status.operatorId);
  }
});

test(
  'anchorEvidence submits a real HCS message on testnet',
  { skip: !hasCredentials },
  async () => {
    const { anchorEvidence, ensureTopic } = await import('../src/services/hederaHCS.ts');

    const topic = await ensureTopic();
    assert.ok(topic.toString().match(/^0\.0\.\d+$/));

    const result = await anchorEvidence({
      eventId: `test-evt-${Date.now()}`,
      deviceId: 'TEST-NODE-CI',
      severity: 'low',
      type: 'integration-test',
      payload: { source: 'hcs.integration.test.ts' },
    });

    assert.equal(result.mode, 'live');
    assert.ok(result.sequenceNumber > 0);
    assert.ok(result.evidenceHash.length === 64);
    assert.ok(result.transactionId.includes('@'));
    assert.ok(result.consensusTimestamp.length > 0);
    assert.ok(result.runningHash.length > 0);
    console.log('[HCS integration] anchored:', result.transactionId, 'seq=', result.sequenceNumber);
  },
);

test('mockAnchorEvidence works without credentials', async () => {
  const { mockAnchorEvidence } = await import('../src/services/mockHardwareHCS.ts');
  const mock = mockAnchorEvidence({
    eventId: 'mock-1',
    deviceId: 'SHIELD-NODE-01',
    severity: 'low',
    type: 'heartbeat',
  });
  assert.equal(mock.mode, 'mock');
  assert.ok(mock.sequenceNumber > 0);
  assert.ok(mock.evidenceHash.length > 0);
});
