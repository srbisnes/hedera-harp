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

The current repository is an **interactive MVP/simulation**, not a production security platform or an independently audited system. This distinction is intentional: the UI demonstrates the operating model while the integration boundaries remain explicit.

## Current MVP

The React application currently includes:

- 📡 IoT node/device management UI.
- 📊 Sensor and telemetry dashboards.
- 🧪 Security-event and incident simulations.
- 🔗 Hedera Consensus Service (HCS) event-flow simulation.
- 💰 Conditional escrow workflow simulation tied to security evidence.
- 🔐 Biometric/critical-action UX simulation.
- 🔔 Notifications and operator alerts.
- 🤖 Swarm/agent-oriented security interaction UI.
- 🗺️ Architecture/blueprint visualization.
- 👤 Local/demo authentication flow.
- 📱 Responsive mobile-oriented security console.

### Important implementation note

The repository contains mock services for hardware, HCS and some authentication/agent interactions. They are **simulation boundaries**, not claims of live production infrastructure.

Before production use, replace mock services with authenticated integrations, define threat models and key-management procedures, add observability, and complete independent security testing.

## Hedera Architecture

### Hedera Consensus Service

HCS is the primary proposed trust primitive. HARP can use consensus messages to establish an ordered and timestamped record of selected security events.

Raw telemetry should normally remain off-ledger. A production design should anchor only the minimum evidence required for independent verification, such as event identifiers, hashes and relevant metadata.

### Hedera Token Service

HTS is an optional extension for use cases involving tokenized credentials, assets, incentives or other explicitly justified token primitives. It is not required for the core HARP event pipeline.

### Hedera Smart Contracts / EVM

Smart contracts can provide programmable verification or settlement workflows where required. The current MVP treats these as integration boundaries rather than claiming a production contract deployment.

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
- Express / Node.js integration boundary
- Hedera HCS / HTS / EVM integration boundaries
- Google GenAI integration boundary
- GitHub
- Vercel-compatible frontend build

## Repository Structure

```text
hedera-harp/
├── src/
│   ├── components/      # UI modules
│   ├── services/        # Mock/integration service boundaries
│   ├── types/           # Protocol and auth types
│   └── utils/           # Browser/device helpers
├── .github/             # CI configuration
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── SECURITY.md
├── LICENSE
└── README.md
```

## Local Development

Requirements: Node.js 20+.

```bash
git clone https://github.com/srbisnes/hedera-harp.git
cd hedera-harp
npm install
npm run lint
npm run build
npm run dev
```

The Vite development server will expose the application locally. For production deployment, use the Vite build output (`dist/`) with a Vercel-compatible configuration.

## Vercel Deployment

The project is Vite-based and can be deployed from the repository with:

- **Framework preset:** Vite
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** 20+

Do not commit API keys, private keys, production credentials or customer telemetry.

## Roadmap

### Phase 1 — Foundation
- [x] Architecture and interactive MVP
- [x] MIT license
- [x] Security policy
- [x] Device/sensor dashboard
- [x] HCS integration boundary
- [ ] Formal event schema
- [ ] Real HARP edge agent

### Phase 2 — Detection & Evidence
- [ ] Authenticated telemetry ingestion
- [ ] Rule engine
- [ ] Device identity and key rotation
- [ ] HCS testnet integration
- [ ] Incident evidence explorer
- [ ] CI security scanning
- [ ] Automated regression tests

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
