# HCS Integration Guide

## Overview

HARP can run in two modes:

| Mode | When | Behavior |
|------|------|----------|
| **Demo (mock)** | `HEDERA_OPERATOR_ID` / `HEDERA_OPERATOR_KEY` missing | Local simulated sequence numbers and hashes |
| **Live** | Credentials present | Real `TopicMessageSubmitTransaction` on Hedera testnet/mainnet |

## Setup (testnet)

1. Create a free account at [portal.hedera.com](https://portal.hedera.com/).
2. Copy Account ID and private key into `.env`:

```env
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e020100...
# Optional after first run:
# HEDERA_TOPIC_ID=0.0.yyyyy
```

3. Install and run:

```bash
npm install
npm run dev
```

On first live anchor the server creates a topic and logs:

```text
[HARP HCS] Topic created: 0.0.zzzz — set HEDERA_TOPIC_ID=0.0.zzzz in .env
```

## API

### `GET /api/hcs/status`

```json
{
  "configured": true,
  "network": "testnet",
  "topicId": "0.0.123456",
  "operatorId": "0.0.xxxxx"
}
```

### `GET /api/hcs/topic`

Returns the active topic (creates one if needed in live mode).

### `POST /api/hcs/anchor`

```json
{
  "eventId": "evt-abc123",
  "deviceId": "SHIELD-NODE-01",
  "severity": "high",
  "type": "tamper",
  "payload": { "sensor": "chassis", "delta": 0.92 },
  "teeSignature": "optional-hex-sig"
}
```

Response (live):

```json
{
  "topicId": "0.0.123456",
  "sequenceNumber": 42,
  "consensusTimestamp": "1712345678.123456789",
  "runningHash": "a1b2c3...",
  "transactionId": "0.0.xxxxx@1712345678.000000001",
  "evidenceHash": "sha256-hex",
  "mode": "live"
}
```

## Evidence design

Only a **hash + metadata** is published on HCS. Full telemetry stays off-chain.

Message schema (`v: 1`):

```json
{
  "v": 1,
  "eventId": "...",
  "deviceId": "...",
  "severity": "low|medium|high|critical",
  "type": "heartbeat|tamper|anomaly|...",
  "hash": "sha256 of canonical off-chain payload",
  "ts": 1712345678000,
  "teeSig": "optional"
}
```

## Tests

```bash
# Unit tests (always run)
npm test

# Live HCS test (skipped without credentials)
npm run test:hcs
```

## Security notes

- Never put operator keys in `VITE_*` variables or client bundles.
- Prefer a dedicated **submit key** (not the operator admin key) in production.
- Rate-limit `/api/hcs/anchor` (already limited to 20 req/min in the demo server).
- Rotate keys and monitor fee spend via Mirror Node / HashScan.
