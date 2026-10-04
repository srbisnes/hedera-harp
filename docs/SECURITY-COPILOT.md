# Autonomous Security Copilot — Diseño

## Objetivo

Un **copiloto de seguridad** que:

1. Observa el estado de nodos, eventos y escrows.
2. **Rankea amenazas** de forma determinista (auditoría).
3. **Sugiere acciones** con flag `autoExecutable`.
4. Solo ejecuta en automático lo que la política permite (notify, anchor).
5. Deja isolate / pause_escrow / biometric a **human-in-the-loop**.

## Arquitectura

```text
Telemetry / Events
        │
        ▼
┌───────────────────┐
│ Detection engine  │  securityEvents.ts
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Security Copilot  │  rankThreats → suggestActions → briefing
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
 Auto path   HITL path
 (notify,    (isolate,
  anchor*)    escrow,
              biometric)
    │           │
    ▼           ▼
 HCS API    Operator Console
```

\* Auto-anchor solo si `lastAnchorMode === 'live'` y severidad ≥ umbral de política.

## Módulo actual

`src/core/securityCopilot.ts`:

- `rankThreats(ctx)` → lista ordenada por score
- `suggestActions(ctx)` → acciones con prioridad y autoExecutable
- `buildCopilotBriefing(ctx)` → texto operativo en español

Contexto mínimo:

```ts
{
  activeNodes, totalNodes, tamperedNodes,
  highSeverityEvents, lastAnchorMode, openEscrows
}
```

## Extensiones previstas

| Capa | Descripción |
|------|-------------|
| Policy engine | YAML: umbrales, allowlist auto-actions por org |
| LLM layer | Gemini/OpenAI **solo** para narrativa; no decide acciones |
| Memory | Últimos N incidentes por org en DB |
| Tools | `anchorEvidence`, `createTicket`, `slack.notify` |
| Eval | Dataset de escenarios → precisión de ranking |

## Seguridad del Copilot

- Ninguna acción irreversible sin HITL en v1.
- Todas las sugerencias y ejecuciones van a audit log.
- El modelo LLM no tiene las private keys; solo el backend HCS.
- Rate limit de acciones automáticas por org.

## Integración UI

1. Header / Swarm panel: mostrar `buildCopilotBriefing`.
2. Botones de acciones sugeridas → confirman HITL o llaman API.
3. Badge “HCS live | demo” según `/api/hcs/status`.
