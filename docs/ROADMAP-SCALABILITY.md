# HARP — Roadmap de Escalabilidad

## Principios

1. **Anclar poco, verificar mucho** — solo hashes/metadata en HCS.
2. **Edge-first** — detección local; nube para correlación y UI.
3. **Multi-tenant desde el diseño** — org_id en todos los eventos.
4. **Costes predecibles** — fees HCS fijos en USD; budgets por tenant.
5. **Human-in-the-loop** en acciones destructivas (isolate, release escrow).

## Fases técnicas

### S0 — Foundation (actual → 4 semanas)
- [x] MVP UI + mocks
- [x] HCS live opcional (`hederaHCS`)
- [x] Schema evidencia v1
- [x] CI lint/test/build + secret scan
- [ ] Multi-tenant auth real (JWT / SSO)
- [ ] Persistencia (Postgres) de eventos y anchors

### S1 — Detection & Evidence (1–2 meses)
- [ ] Rule engine + scores (reutilizar `securityEvents` + Copilot)
- [ ] Webhook / MQTT ingestion autenticada
- [ ] Mirror Node indexer (topic → DB)
- [ ] Incident evidence explorer en UI
- [ ] Rate limits por org + budgets HCS

### S2 — Autonomous Copilot (2–3 meses)
- [ ] Ranking + playbooks productizados
- [ ] Auto-anchor HIGH/CRITICAL (policy flag)
- [ ] Notificaciones (email/Slack/PagerDuty)
- [ ] LLM narrative opcional (Gemini) con ground truth de ranking
- [ ] Audit log de decisiones del Copilot

### S3 — Scale (3–6 meses)
- [ ] Horizontal API (stateless) + queue (Redis/SQS)
- [ ] Sharded topics HCS por org o por severity
- [ ] Edge agent real (ESP32 + ATECC) + OTA firmada
- [ ] Device identity (DID / HCS-10 style)
- [ ] Observability: OpenTelemetry, SLOs (anchor latency, error budget)

### S4 — Enterprise & Omnichain (6–12 meses)
- [ ] Federated orgs + data residency
- [ ] Escrow smart contracts condicionados a HCS proof
- [ ] Cross-chain attestations (opcional LayerZero/Axelar de commitments)
- [ ] Independent security assessment
- [ ] Mainnet production playbook + SOC2-ready controls

## Escalabilidad de datos

| Capa | Tecnología | Escala objetivo |
|------|------------|-----------------|
| Ingesta | MQTT / HTTPS + queue | 10k msg/s burst |
| Detección | Workers stateless | Auto-scale K8s |
| Evidence | HCS topics (1–N por org) | Millones msg/día |
| Index | Mirror Node → Postgres/ClickHouse | Query SOC interactivo |
| UI | CDN + SPA | Miles operadores |

## Límites Hedera a respetar

- Mensaje HCS ~1 KB (usar chunks solo si hace falta).
- No duplicar telemetría on-chain.
- Submit key dedicada ≠ operator admin.
- Monitor fee spend por tenant.

## KPIs de escala

- P95 anchor latency < 8s (testnet) / < 6s (mainnet)
- Error rate submit HCS < 0.1%
- Coste HCS / evento anclado < $0.001 all-in plataforma
- Soporte 10k nodos en un solo cluster de API
