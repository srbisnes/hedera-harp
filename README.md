# 🛡️ Hedera Shield Protocol (HARP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hedera](https://img.shields.io/badge/Hedera-Network-4B5EFF.svg)](https://hedera.com/)
[![IoT Security](https://img.shields.io/badge/IoT-Security-0EA5E9.svg)](https://www.nist.gov/topics/internet-things-iot)
[![Status](https://img.shields.io/badge/Status-Active%20Development-F59E0B.svg)](#roadmap)
[![License](https://img.shields.io/badge/Contributions-Welcome-22C55E.svg)](#contributing)

> **HARP (Hedera Shield Protocol)** is a security architecture for IoT environments that combines edge telemetry, threat detection, automated response workflows and verifiable security-event records using Hedera.

**Live demo:** deployable as a static web application on Vercel.  
**Repository:** [Hedera Shield Protocol](https://github.com/srbisnes/hedera-harp)

---

## Overview

IoT expands the attack surface of industrial environments, logistics networks, smart infrastructure and connected devices. HARP is designed as a **trust and evidence layer** between edge telemetry and security operations.

The architecture separates fast local detection from durable, independently verifiable event evidence:

```text
┌──────────────────────┐
│      IoT Devices     │
│ sensors / gateways   │
└──────────┬───────────┘
           │ telemetry
           ▼
┌──────────────────────┐
│      HARP Agent      │
│ edge integrity +     │
│ local anomaly checks │
└──────────┬───────────┘
           │ normalized events
           ▼
┌──────────────────────┐
│ Threat Detection     │
│ Engine               │
│ correlation + rules  │
└──────────┬───────────┘
           │ security events
           ▼
┌──────────────────────┐
│ Hedera Consensus     │
│ Service (HCS)        │
│ ordered + timestamped│
│ consensus records    │
└──────────┬───────────┘
           │ evidence
           ▼
┌──────────────────────┐
│ Security Dashboard   │
│ alerts / audit /     │
│ device posture       │
└──────────────────────┘
```

HARP does **not** put sensitive telemetry on a public ledger by default. A production implementation should keep raw data off-ledger and anchor only the minimum evidence needed for verification.

## Core Objectives

- Detect abnormal device behavior close to the edge.
- Establish a consistent security-event format.
- Correlate events before escalation.
- Anchor selected event evidence through Hedera Consensus Service.
- Provide an operator-facing security dashboard.
- Support auditable incident timelines.
- Create a foundation for automated response and predictive security.

## Architecture

### 1. HARP Agent

Runs on an IoT gateway or edge node.

**Responsibilities**
- Collect device telemetry.
- Validate message structure and integrity metadata.
- Apply local rules and anomaly checks.
- Normalize events before forwarding them.
- Communicate with the control plane through authenticated channels.

### 2. Threat Detection Engine

The analytical layer responsible for converting telemetry into security signals.

**Initial capabilities**
- Rule-based anomaly detection.
- Event correlation.
- Severity classification.
- Device risk scoring.
- Alert generation.
- Response-policy evaluation.

Future versions can add statistical and ML-based detection without coupling the detection engine to the ledger.

### 3. Hedera Layer

HARP is designed to integrate with:

- **Hedera Consensus Service (HCS)** for ordered, timestamped consensus messages and security-event evidence.
- **Hedera Token Service (HTS)** where a future product requirement genuinely benefits from tokenized assets or credentials.
- **Hedera Smart Contracts / EVM** for programmable verification and ecosystem integrations.

HCS is the primary ledger primitive in the current architecture. HTS and smart contracts are optional extensions, not requirements for the core security pipeline.

### 4. Security Dashboard

The included web interface provides a professional MVP surface for:

- Device posture.
- Active alerts.
- Event throughput.
- Severity distribution.
- Recent security events.
- Architecture visibility.
- Demo-mode response actions.

The dashboard is intentionally transparent about demo data: it is an operational UI prototype, not a claim that a production security backend is already connected.

## Event Model

A normalized HARP event can be represented conceptually as:

```json
{
  "eventId": "evt_01",
  "deviceId": "edge-gateway-07",
  "timestamp": "2026-10-02T13:00:00Z",
  "type": "anomaly.detected",
  "severity": "high",
  "signal": "unexpected-command-rate",
  "evidenceHash": "sha256:...",
  "source": "edge-agent"
}
```

Production deployments should define authentication, replay protection, key rotation, retention, privacy and incident-response policies before connecting real infrastructure.

## Security Model

HARP follows a defense-in-depth model:

1. **Edge validation** — reject malformed or unauthenticated telemetry.
2. **Local detection** — detect high-signal anomalies without waiting for a remote service.
3. **Central correlation** — combine signals across devices and time windows.
4. **Evidence anchoring** — submit selected event evidence to HCS.
5. **Operator response** — route alerts to security workflows.
6. **Audit trail** — preserve a verifiable incident timeline.

### Important security boundary

HARP is an architecture and active-development MVP. It is **not an audited security product** and should not be deployed into safety-critical or production environments without independent security review, threat modeling, hardening and operational testing.

## Use Cases

| Sector | Example |
|---|---|
| 🏭 Industrial IoT | Sensor integrity, gateway anomalies, operational evidence |
| 🏙 Smart infrastructure | Connected infrastructure monitoring and incident timelines |
| 🚚 Logistics | Asset telemetry and verifiable incident evidence |
| 🏥 Medical environments | Equipment integrity monitoring and audit evidence |
| ⚡ Critical infrastructure | Edge anomaly detection and security-event correlation |

## Technology Stack

- Hedera Hashgraph
- Hedera Consensus Service
- Optional Hedera Token Service / EVM integrations
- Edge / IoT computing
- HTML, CSS and JavaScript for the current dashboard MVP
- REST / WebSocket integration points
- Docker-ready architecture
- GitHub
- Vercel

## Repository Structure

```text
hedera-harp/
├── agents/              # Edge-agent implementation boundary
├── api/                 # API integration boundary
├── architecture/        # Architecture assets and diagrams
├── assets/              # Static project assets
├── dashboard/           # Dashboard application assets
├── docs/                # Technical documentation
├── scripts/             # Operational scripts
├── security/            # Security policies and threat-model material
├── tests/               # Automated tests
├── .github/             # CI and repository automation
├── index.html           # Public HARP dashboard/demo
├── app.js               # Demo dashboard behavior
├── styles.css           # Dashboard styles
├── LICENSE              # Full MIT license
├── SECURITY.md          # Security policy
└── README.md
```

## Roadmap

### Phase 1 — Foundation
- [x] Architecture definition
- [x] HCS integration boundary
- [x] Security dashboard MVP
- [x] MIT licensing
- [ ] Working HARP edge-agent prototype
- [ ] Event schema package

### Phase 2 — Detection & Evidence
- [ ] Real telemetry ingestion
- [ ] Rule engine
- [ ] Device identity and key management
- [ ] HCS testnet integration
- [ ] Incident evidence explorer
- [ ] Automated CI security checks

### Phase 3 — Advanced Security
- [ ] Behavioral anomaly detection
- [ ] Predictive risk models
- [ ] Digital-twin security views
- [ ] Multi-organization federation
- [ ] Independent security assessment
- [ ] Production deployment playbook

## Local Development

This MVP has no build step.

```bash
git clone https://github.com/srbisnes/hedera-harp.git
cd hedera-harp

# Serve locally with any static HTTP server.
python -m http.server 8080
```

Open `http://localhost:8080`.

For production integrations, keep credentials and network configuration outside the repository.

## Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make focused changes and add tests where behavior changes.
4. Commit using a clear message:

```bash
git commit -m "feat: add edge event validation"
```

5. Push the branch and open a Pull Request.

Please do not submit credentials, private keys, customer telemetry or other sensitive information.

## License

HARP is released under the MIT License. See [LICENSE](./LICENSE).

## Author

**ElCryptoBoy**  
Founder & Builder

- GitHub: [@srbisnes](https://github.com/srbisnes)
- Focus: Web3, blockchain, AI and security-oriented product development

---

> **Building verifiable trust for connected infrastructure.**
