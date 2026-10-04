/**
 * HARP — Real Hedera Consensus Service (HCS) integration
 *
 * Anchors minimal security evidence (hash + metadata) on HCS.
 * Raw telemetry stays off-ledger. Requires HEDERA_OPERATOR_ID + HEDERA_OPERATOR_KEY.
 * When credentials are missing, isHcsConfigured() returns false and callers should
 * fall back to mockHardwareHCS.
 */

import {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  Hbar,
} from '@hashgraph/sdk';
import { createHash } from 'node:crypto';

export type EvidenceSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvidence {
  eventId: string;
  deviceId: string;
  severity: EvidenceSeverity;
  type: string;
  /** Off-chain payload; only its hash is published on HCS */
  payload: Record<string, unknown>;
  teeSignature?: string;
}

export interface HCSAnchorResult {
  topicId: string;
  sequenceNumber: number;
  consensusTimestamp: string;
  runningHash: string;
  transactionId: string;
  evidenceHash: string;
  mode: 'live';
}

let client: Client | null = null;
let topicId: TopicId | null = null;

/** Returns true when operator credentials are present (live HCS mode). */
export function isHcsConfigured(): boolean {
  return Boolean(process.env.HEDERA_OPERATOR_ID && process.env.HEDERA_OPERATOR_KEY);
}

function getClient(): Client {
  if (client) return client;

  const network = (process.env.HEDERA_NETWORK || 'testnet').toLowerCase();
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY;

  if (!operatorId || !operatorKey) {
    throw new Error(
      'HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY are required for live HCS. ' +
        'Copy .env.example → .env and add testnet credentials from https://portal.hedera.com/',
    );
  }

  client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
  client.setDefaultMaxTransactionFee(new Hbar(2));
  client.setDefaultMaxQueryPayment(new Hbar(1));

  return client;
}

/**
 * Ensures a topic exists. Uses HEDERA_TOPIC_ID if set; otherwise creates one
 * and logs the ID (persist it in .env for subsequent runs).
 */
export async function ensureTopic(): Promise<TopicId> {
  if (topicId) return topicId;

  const existing = process.env.HEDERA_TOPIC_ID?.trim();
  if (existing) {
    topicId = TopicId.fromString(existing);
    return topicId;
  }

  const c = getClient();
  const tx = await new TopicCreateTransaction()
    .setTopicMemo('HARP Security Evidence Topic v1')
    .setAdminKey(c.operatorPublicKey!)
    .setSubmitKey(c.operatorPublicKey!)
    .execute(c);

  const receipt = await tx.getReceipt(c);
  topicId = receipt.topicId!;
  console.log(`[HARP HCS] Topic created: ${topicId.toString()} — set HEDERA_TOPIC_ID=${topicId.toString()} in .env`);
  return topicId;
}

function buildEvidenceHash(evidence: SecurityEvidence): string {
  const canonical = JSON.stringify({
    eventId: evidence.eventId,
    deviceId: evidence.deviceId,
    severity: evidence.severity,
    type: evidence.type,
    payload: evidence.payload,
    teeSignature: evidence.teeSignature ?? null,
  });
  return createHash('sha256').update(canonical).digest('hex');
}

/**
 * Anchors minimal evidence on HCS.
 * Only publishes eventId, deviceId, severity, type, hash, timestamp and optional TEE sig.
 */
export async function anchorEvidence(evidence: SecurityEvidence): Promise<HCSAnchorResult> {
  if (!evidence.eventId?.trim() || !evidence.deviceId?.trim() || !evidence.type?.trim()) {
    throw new Error('eventId, deviceId and type are required');
  }

  const c = getClient();
  const tid = await ensureTopic();
  const evidenceHash = buildEvidenceHash(evidence);

  const message = JSON.stringify({
    v: 1,
    eventId: evidence.eventId,
    deviceId: evidence.deviceId,
    severity: evidence.severity,
    type: evidence.type,
    hash: evidenceHash,
    ts: Date.now(),
    ...(evidence.teeSignature ? { teeSig: evidence.teeSignature } : {}),
  });

  if (Buffer.byteLength(message, 'utf8') > 1000) {
    throw new Error('HCS message too large (>1000 bytes); reduce payload metadata');
  }

  const submitTx = await new TopicMessageSubmitTransaction()
    .setTopicId(tid)
    .setMessage(message)
    .execute(c);

  const receipt = await submitTx.getReceipt(c);
  const record = await submitTx.getRecord(c);

  return {
    topicId: tid.toString(),
    sequenceNumber: Number(receipt.topicSequenceNumber),
    consensusTimestamp: record.consensusTimestamp!.toString(),
    runningHash: Buffer.from(receipt.topicRunningHash!).toString('hex'),
    transactionId: submitTx.transactionId!.toString(),
    evidenceHash,
    mode: 'live',
  };
}

/** Convenience helper for device heartbeats. */
export async function anchorHeartbeat(deviceId: string, extra?: Record<string, unknown>) {
  return anchorEvidence({
    eventId: `hb-${deviceId}-${Date.now()}`,
    deviceId,
    severity: 'low',
    type: 'heartbeat',
    payload: { status: 'ok', ...extra },
  });
}

export function getHcsStatus(): {
  configured: boolean;
  network: string;
  topicId: string | null;
  operatorId: string | null;
} {
  return {
    configured: isHcsConfigured(),
    network: (process.env.HEDERA_NETWORK || 'testnet').toLowerCase(),
    topicId: process.env.HEDERA_TOPIC_ID?.trim() || topicId?.toString() || null,
    operatorId: process.env.HEDERA_OPERATOR_ID || null,
  };
}
