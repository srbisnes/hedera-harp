# HARP Architecture

HARP is an IoT security architecture and product MVP for collecting device signals, evaluating security events and anchoring selected evidence to Hedera Consensus Service (HCS).
The design separates telemetry, detection, evidence, autonomous assistance and operator UX.

## Logical architecture

```text
IoT / Edge Devices
        │
        ▼
HARP Edge Agent → Detection / Policy → Evidence Adapter → Hedera HCS
        │                                    │
        │                                    ▼
        │                            Security Copilot
        │                         (rank · suggest · brief)
        │                                    │
        └────────────────────────────────────┴──→ Security Console
```

## Repository boundaries

- `src/components/` — UI modules.
- `src/services/` — integration and demo adapters (`hederaHCS`, mocks).
- `src/core/` — deterministic domain logic (`securityEvents`, `securityCopilot`).
- `src/types/` — shared domain types.
- `server.ts` — Express API (health, HCS, swarm-chat) + Vite.
- `docs/` — architecture, business, HCS, copilot, roadmap.
- `tests/` — unit + optional HCS integration.
- `.github/workflows/` — CI quality, security scan, release.

## Data policy

Do not put raw sensitive telemetry, credentials, private keys or personal data on a public ledger.
A production evidence payload should normally contain only: event identifier, pseudonymous device identity, normalized timestamp, evidence hash and policy metadata.
Raw telemetry remains in a controlled store with retention and access policies.

## Trust boundaries

1. Device → edge agent: identity and authenticity.
2. Edge agent → detection: schema validation and replay protection.
3. Detection → evidence adapter: canonicalization and policy decision.
4. Evidence adapter → HCS: authenticated service account / submit key.
5. Copilot → actions: auto only for non-destructive; HITL for isolate/escrow.
6. Console → operator: authorization, audit logging, secure sessions.

The repository implements the console, optional live HCS, and deterministic Copilot helpers. Production trust boundaries still require auth, persistence and independent review.

See also: [HCS-INTEGRATION.md](./HCS-INTEGRATION.md), [SECURITY-COPILOT.md](./SECURITY-COPILOT.md), [STRUCTURE.md](./STRUCTURE.md).
