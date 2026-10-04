# 🛡️ Hedera Shield Protocol (HARP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hedera](https://img.shields.io/badge/Hedera-Network-4B5EFF.svg)](https://hedera.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev/)
[![Status](https://img.shields.io/badge/Status-Active%20Development-F59E0B.svg)](#roadmap)

> **HARP (Hedera Shield Protocol)** is an IoT security architecture and interactive MVP that combines edge-device monitoring, threat/event simulation, security workflows and verifiable event evidence around the Hedera ecosystem.

## What HARP is

HARP is designed as a **security and evidence layer for connected infrastructure**. The application separates device/edge telemetry from the trust layer:

```text
IoT / Edge Devices
        │
        ▼
┌─────────────────────┐
│ HARP Agent          │
│ integrity + signals │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ Detection / Policy  │
│ correlation + risk  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ Hedera HCS          │
│ consensus evidence  │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ Security Console    │
│ alerts + audit      │
└─────────────────────┘
```

The current repository is an **interactive MVP** with an optional **live HCS integration**. Without Hedera credentials it runs fully in demo/simulation mode. This distinction is intentional: the UI demonstrates the operating model while production boundaries remain explicit.

## Current MVP

The React application currently includes:

- 📡 IoT node/device management UI.
- 📊 Sensor and telemetry dashboards.
- 🧪 Security-event and incident simulations.
- 🔗 **Hedera Consensus Service (HCS)** — live testnet anchoring when credentials are set, otherwise mock.
- 💰 Conditional escrow workflow simulation tied to security evidence.
- 🔐 Biometric/critical-action UX simulation.
- 🔔 Notifications and operator alerts.
- 🤖 Swarm/agent-oriented security interaction UI.
- 🗺️ Architecture/blueprint visualization.
- 👤 Local/demo authentication flow.
- 📱 Responsive mobile-oriented security console.

### Important implementation note

Mock services remain for hardware, biometrics and some auth flows. **HCS can run live** when `HEDERA_OPERATOR_ID` and `HEDERA_OPERATOR_KEY` are configured (see [docs/HCS-INTEGRATION.md](./docs/HCS-INTEGRATION.md)).

Before production use, complete independent security testing, harden key management, and add observability.

## Hedera Architecture

### Hedera Consensus Service

HCS is the primary trust primitive. HARP anchors **minimal evidence** (event id, device id, severity, type, SHA-256 hash, timestamp) via `TopicMessageSubmitTransaction`. Raw telemetry stays off-ledger.

| Mode | Condition | Behavior |
|------|-----------|----------|
| Demo | No operator keys | `mockAnchorEvidence` — local sequence/hash |
| Live | Keys in `.env` | Real HCS topic create + submit on testnet/mainnet |

API endpoints:

- `GET /api/hcs/status` — configuration status
- `GET /api/hcs/topic` — active topic id
- `POST /api/hcs/anchor` — anchor security evidence

### Hedera Token Service

HTS is an optional extension for tokenized credentials, assets or incentives. Not required for the core evidence pipeline.

### Hedera Smart Contracts / EVM

Smart contracts can provide programmable verification or settlement. The current MVP treats these as integration boundaries.

## Security Model

HARP follows a defense-in-depth model:

1. **Edge validation** — validate device messages before central processing.
2. **Local detection** — detect high-signal anomalies close to the source.
3. **Correlation** — combine signals across devices and time.
4. **Evidence anchoring** — record selected evidence through HCS.
5. **Response workflow** — route high-severity events to operator actions.
6. **Audit trail** — preserve a verifiable incident timeline.

### Security boundary

HARP is active development. It has **not been represented as independently audited**. Do not connect this MVP directly to safety-critical or production infrastructure without independent security review, hardening, secure key management, monitoring, incident response and operational testing.

See [SECURITY.md](./SECURITY.md).

## Use Cases

| Sector | Example |
|---|---|
| 🏭 Industrial IoT | Device integrity, anomalies and operational evidence |
| 🏙 Smart infrastructure | Connected-device monitoring and incident timelines |
| 🚚 Logistics | Asset telemetry and verifiable incident evidence |
| 🏥 Medical environments | Equipment integrity and audit workflows |
| ⚡ Critical infrastructure | Edge detection and security-event correlation |

## Technology Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion
- Express / Node.js
- **@hashgraph/sdk** (HCS live integration)
- Google GenAI integration boundary
- GitHub + Vercel-compatible frontend build

## Repository Structure

```text
hedera-harp/
├── src/
│   ├── components/      # UI modules
│   ├── core/            # Security event schema & hashing
│   ├── services/        # hederaHCS (live) + mocks
│   ├── types/           # Protocol and auth types
│   └── utils/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── HCS-INTEGRATION.md
│   └── ...
├── tests/
│   ├── securityEvents.test.ts
│   └── hcs.integration.test.ts
├── server.ts            # Express + Vite + HCS API
├── package.json
└── README.md
```

## Local Development

Requirements: Node.js 20+.

```bash
git clone https://github.com/srbisnes/hedera-harp.git
cd hedera-harp
cp .env.example .env
npm install
npm run test
npm run lint
npm run build
npm run dev
```

### Optional: live HCS on testnet

1. Get free credentials at [portal.hedera.com](https://portal.hedera.com/).
2. Set in `.env`:

```env
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...
```

3. Restart `npm run dev`. First anchor creates a topic (log prints the id — save as `HEDERA_TOPIC_ID`).
4. Run live test: `npm run test:hcs`

Full guide: [docs/HCS-INTEGRATION.md](./docs/HCS-INTEGRATION.md).

## Vercel Deployment

- **Framework preset:** Vite
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** 20+

For live HCS on Vercel, add `HEDERA_*` as **server-side** environment variables only. Do not commit keys or expose them as `VITE_*`.

## Roadmap

### Phase 1 — Foundation
- [x] Architecture and interactive MVP
- [x] MIT license
- [x] Security policy
- [x] Device/sensor dashboard
- [x] HCS integration boundary
- [x] Formal event schema (`SecurityEvidence` + hash)
- [ ] Real HARP edge agent

### Phase 2 — Detection & Evidence
- [ ] Authenticated telemetry ingestion
- [ ] Rule engine
- [ ] Device identity and key rotation
- [x] **HCS testnet integration** (optional live mode)
- [ ] Incident evidence explorer
- [ ] CI security scanning
- [x] Automated regression tests (+ optional HCS integration test)

### Phase 3 — Production Readiness
- [ ] Behavioral anomaly detection
- [ ] Predictive risk models
- [ ] Multi-organization federation
- [ ] Independent security assessment
- [ ] Production deployment playbook
- [ ] SLA/observability model

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make focused changes.
4. Run `npm run lint` and `npm run build`.
5. Commit and open a Pull Request.

Never submit credentials, private keys or sensitive telemetry.

## License

Released under the MIT License. See [LICENSE](./LICENSE).

## Author

**ElCryptoBoy** — Founder & Builder

- GitHub: [repository](https://github.com/srbisnes/hedera-harp)
- Focus: Web3, blockchain, AI, IoT and security-oriented product development

---

> **Building verifiable trust for connected infrastructure.**
