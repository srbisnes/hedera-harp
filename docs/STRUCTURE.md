# Estructura del repositorio HARP (v0.2+)

```text
hedera-harp/
├── .github/
│   └── workflows/
│       ├── ci.yml              # lint, test, build, secrets, optional HCS
│       └── release.yml         # tag v* → GitHub Release
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BUSINESS-MODEL.md       # monetización y GTM
│   ├── DEVELOPMENT.md
│   ├── HCS-INTEGRATION.md      # setup live HCS
│   ├── IMPLEMENTATION-PLAN.md  # sprints + ICE prioritization
│   ├── ROADMAP-SCALABILITY.md
│   ├── SECURITY-COPILOT.md
│   ├── STRUCTURE.md            # este archivo
│   └── THREAT-MODEL.md
├── src/
│   ├── components/             # UI React
│   ├── core/
│   │   ├── securityEvents.ts   # severidad + hash evidencia
│   │   └── securityCopilot.ts  # ranking + acciones + briefing
│   ├── services/
│   │   ├── hederaHCS.ts        # live HCS
│   │   ├── mockHardwareHCS.ts  # demo + fallback
│   │   ├── swarmService.ts
│   │   ├── biometricService.ts
│   │   └── googleAuthService.ts
│   ├── types/
│   │   ├── protocol.ts
│   │   └── auth.ts
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── securityEvents.test.ts
│   ├── protocol.test.ts
│   ├── copilot.test.ts
│   └── hcs.integration.test.ts # requiere credenciales
├── server.ts                   # Express + Vite + HCS API
├── package.json
├── .env.example
├── SECURITY.md
└── README.md
```

## Contratos API (backend)

| Method | Path | Auth (futuro) | Descripción |
|--------|------|---------------|-------------|
| GET | `/api/health` | — | Health + HCS status |
| GET | `/api/hcs/status` | — | configured / network / topic |
| GET | `/api/hcs/topic` | — | topic id live o mock |
| POST | `/api/hcs/anchor` | API key | Ancla evidencia |
| POST | `/api/swarm-chat` | — | Asistente (Gemini o demo) |

## Variables de entorno clave

Ver `.env.example`. Nunca `VITE_*` para keys de Hedera.
