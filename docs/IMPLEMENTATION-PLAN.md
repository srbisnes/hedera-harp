# HARP — Plan de Implementación

## Priorización por impacto (ICE-like)

Impacto × Confianza × Facilidad (1–5). Orden de ejecución recomendado:

| # | Iniciativa | Impacto | Confianza | Facilidad | Score | Por qué |
|---|------------|---------|-----------|-----------|-------|---------|
| 1 | HCS live + API anchor | 5 | 5 | 4 | 100 | Diferenciador on-chain, ya implementado |
| 2 | Persistencia eventos + anchors | 5 | 5 | 3 | 75 | Sin DB no hay producto multi-sesión |
| 3 | Auth multi-tenant | 5 | 4 | 3 | 60 | Condición para SaaS |
| 4 | Security Copilot ranking | 4 | 5 | 5 | 100 | Bajo coste, alto valor percibido |
| 5 | CI/CD + secret scan | 4 | 5 | 5 | 100 | Confianza y velocidad de merge |
| 6 | Evidence explorer UI | 4 | 4 | 3 | 48 | Cierra el loop operador |
| 7 | MQTT/HTTPS ingestion | 5 | 3 | 2 | 30 | Necesario para IoT real |
| 8 | Escrow condicionado | 4 | 3 | 2 | 24 | Monetización premium |
| 9 | Edge agent hardware | 5 | 3 | 1 | 15 | Largo plazo, alto moat |
| 10 | Mainnet + auditoría | 5 | 2 | 1 | 10 | Solo tras threat model |

## Sprint 0 (esta entrega — en repo)

- [x] `hederaHCS` + endpoints
- [x] Mock fallback
- [x] Schema protocol + tests
- [x] Security Copilot core (`rankThreats`, `suggestActions`, `buildCopilotBriefing`)
- [x] CI ampliado + release workflow
- [x] Docs: business, scalability, HCS, architecture

## Sprint 1 (2 semanas)

1. Postgres schema: `organizations`, `devices`, `events`, `anchors`.
2. `POST /api/events` → detect → optional auto-anchor.
3. Wire Copilot briefing al panel Swarm / Header.
4. Feature flag `HCS_AUTO_ANCHOR_SEVERITY=high`.

## Sprint 2 (2 semanas)

1. Auth JWT (o Clerk/Auth0) + org scoping.
2. Evidence explorer: lista anchors desde DB + link HashScan.
3. Alertas Slack/email en critical.
4. npm audit en CI fail-on-critical.

## Sprint 3 (3–4 semanas)

1. Ingestión autenticada (API keys por device).
2. Mirror Node poller → backfill sequence/runningHash.
3. Playbooks YAML (isolate, notify, pause_escrow).
4. Pilot con 1 cliente industrial (25–50 nodos testnet).

## Sprint 4+

- Edge agent, escrow contracts, mainnet checklist (ver ROADMAP-SCALABILITY).

## Definition of Done (cada feature)

- Tests unitarios o integración
- Tipos TypeScript sin `any` injustificado
- Sin secrets en cliente
- Documentado en `/docs` si cambia contrato API
- CI verde
