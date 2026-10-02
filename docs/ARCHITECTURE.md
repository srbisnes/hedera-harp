# HARP Architecture

HARP is an IoT security architecture and product MVP for collecting device signals, evaluating security events and anchoring selected evidence to a consensus layer such as Hedera Consensus Service (HCS).
The design separates telemetry, detection, evidence and operator UX.

## Logical architecture

IoT / Edge Devices
        |
        v
HARP Edge Agent -> Detection / Policy -> Evidence Adapter -> Hedera HCS
                                                        |
                                                        v
                                                HARP Security Console

## Repository boundaries
- src/components/ — UI modules.
- src/services/ — integration and demo adapters.
- src/core/ — deterministic security-domain logic.
- src/types/ — shared domain types.
- server.ts — optional server-side AI proxy.
- docs/ — architecture and operational documentation.
- tests/ — deterministic regression tests.

## Data policy
Do not put raw sensitive telemetry, credentials, private keys or personal data on a public ledger.
A production evidence payload should normally contain only the minimum required fields: event identifier, pseudonymous device identity, normalized timestamp, evidence hash and policy metadata.
Raw telemetry should remain in a controlled data store with explicit retention and access policies.

## Trust boundaries
1. Device to edge agent: device identity and message authenticity.
2. Edge agent to detection engine: schema validation and replay protection.
3. Detection engine to evidence adapter: canonicalization and policy decision.
4. Evidence adapter to HCS: authenticated service account.
5. Console to operator: authorization, audit logging and secure session management.

The current repository implements the console and simulation boundaries. It does not claim that these production trust boundaries are complete.