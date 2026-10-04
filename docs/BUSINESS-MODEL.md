# HARP — Modelo de Negocio

## Problema

Infraestructura conectada (IoT industrial, logística, critical infrastructure) genera telemetría y alertas, pero **carece de evidencia verificable e inmutable** para auditorías, seguros, compliance y liquidaciones. Las plataformas SOC tradicionales son centralizadas, costosas y no anclan evidencia en un ledger de consenso de bajo coste fijo.

## Solución

**HARP** = capa de seguridad + evidencia sobre Hedera HCS:

1. Detección en el edge / agente.
2. Anclaje de hash + metadata en HCS (centavos fijos, finality ~3–5s).
3. Consola SOC + **Autonomous Security Copilot**.
4. Flujos de escrow / settlement condicionados a evidencia.

## Segmentos de cliente (prioridad de ingresos)

| Segmento | Dolor | Disposición a pagar | Prioridad |
|----------|-------|---------------------|-----------|
| Industrial IoT / OT | Sabotaje, downtime, auditorías ISO | Alta (contratos anuales) | P0 |
| Logistics & cold chain | Cadena de custodia, seguros | Alta | P0 |
| Smart infrastructure / cities | Incidentes públicos, transparencia | Media–Alta | P1 |
| Medical devices (no PHI on-ledger) | Compliance, integrity | Alta (regulated) | P1 |
| Crypto custody / OTC desks | Escrow + proof of shield | Media–Alta | P1 |
| MSSP / SOC-as-a-service | White-label evidence layer | Media | P2 |

## Oferta de productos

### 1. HARP Core (SaaS)
- Consola + agentes + HCS anchoring
- Planes por nodos / eventos anclados / organizaciones

### 2. HARP Evidence API
- `POST /anchor`, webhooks, Mirror Node index
- Precio por mensaje HCS + markup de plataforma

### 3. HARP Copilot (add-on)
- Ranking de amenazas, playbooks, human-in-the-loop
- Precio por seat SOC o por incident-pack

### 4. HARP Escrow / Settlement (premium)
- Liberación condicionada a evidencia HCS + biometric
- Fee % sobre valor en escrow o flat por sesión

### 5. Edge Agent license
- Firmware / SDK para ESP32 + TEE
- License per device o OEM bundle

## Modelo de precios (orientativo testnet → mainnet)

| Plan | Nodos | Eventos HCS/mes | Precio/mes | Notas |
|------|-------|-----------------|------------|-------|
| Starter | 25 | 10k | $99 | Solo testnet / demo |
| Growth | 200 | 100k | $499 | Multi-org, Copilot basic |
| Scale | 2 000 | 1M | $2 499 | SLA, SSO, dedicated topic |
| Enterprise | Custom | Unlimited | Custom | On-prem agent, audit, escrow |

**Unit economics (orden de magnitud)**  
- Coste HCS testnet/mainnet: ~$0.0001 por mensaje → margen bruto alto en API.  
- Coste dominante: soporte, edge firmware, compliance, sales.

## Fuentes de ingresos prioritarias (rentables y variables)

1. **Suscripción SaaS por nodo activo** — recurrente, predecible.  
2. **Usage HCS (overage)** — variable, escala con valor del cliente.  
3. **Copilot seats** — alto margen software.  
4. **Escrow fees** — alineado con valor financiero en riesgo.  
5. **OEM / white-label MSSP** — contratos multi-año.

## Go-to-market

1. **Beachhead:** 3–5 pilotos Industrial IoT + logistics (LatAm / EU).  
2. **Proof:** dashboard + HCS live testnet + 1 playbook Copilot.  
3. **Expansion:** partners integradores OT, aseguradoras (evidence for claims), exchanges/OTC.  
4. **Moat:** schema de evidencia + device identity + historial HCS + playbooks verticales.

## Métricas norte

- Nodos activos pagos (MRR)
- Eventos anclados / mes (usage)
- Time-to-anchor P95
- % incidentes con evidencia HCS
- NRR (net revenue retention) > 110%

## No hacer (anti-prioridades)

- No poner telemetría raw on-ledger.
- No competir como SIEM genérico full-stack en año 1.
- No mainnet production sin threat model + key mgmt + auditoría.
