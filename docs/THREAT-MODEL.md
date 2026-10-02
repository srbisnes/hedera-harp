# HARP Threat Model

## Assets
- Device identity and signing material.
- Security-event evidence.
- Operator accounts and authorization state.
- Hedera account/topic credentials.
- Incident history.
- Customer telemetry.

## Threats
| Threat | Example | Control direction |
|---|---|---|
| Credential theft | leaked HCS key | secret manager, rotation, least privilege |
| Device spoofing | forged telemetry | device identity and signed messages |
| Replay | old heartbeat reused | nonce/sequence and freshness window |
| Evidence tampering | modified event before anchoring | canonicalization and cryptographic hash |
| API abuse | endpoint flooding | authentication, rate limiting and quotas |
| Privilege escalation | critical action without authorization | RBAC and step-up authentication |
| Data leakage | raw telemetry exposed | minimization, encryption and retention |
| Supply-chain attack | compromised dependency | lockfile and SCA in CI |
| Availability attack | edge/API flood | queueing, backpressure and rate limits |

## MVP security posture
This repository is an MVP. Google OAuth, biometric authentication, hardware attestation, HCS transaction signing, smart-contract escrow and multi-tenant authorization are integration boundaries, not claims of completed production controls.
Production deployment requires threat modeling, secure key management, observability, incident response and independent security assessment.