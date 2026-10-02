import { SwarmAgent, SwarmChatMessage } from '../types/auth';
import { IoTShieldNode, EscrowSession } from '../types/protocol';

export const SWARM_AGENTS: SwarmAgent[] = [
  {
    id: 'agent-coordinator',
    name: 'Coordinador HSP',
    role: 'Orquestador & Guía General',
    specialty: 'Explica el propósito, visión de la app y asiste en operaciones',
    avatarIcon: '🤖',
    color: '#06b6d4', // cyan
    status: 'active',
  },
  {
    id: 'agent-depin',
    name: 'Centinela DePIN',
    role: 'Ingeniero de Hardware IoT',
    specialty: 'Ultrasonido 25kHz, saturación MEMS, anti-tamper y ESP32-S3',
    avatarIcon: '🛡️',
    color: '#10b981', // emerald
    status: 'active',
  },
  {
    id: 'agent-hedera',
    name: 'Hashgraph Oracle',
    role: 'Especialista en Hedera L1',
    specialty: 'Hedera Consensus Service (HCS), Topic 0.0.654321 y Escrow HSCS',
    avatarIcon: '⚡',
    color: '#6366f1', // indigo
    status: 'active',
  },
  {
    id: 'agent-crypto',
    name: 'Guardián Cripto',
    role: 'Oficial de Seguridad & TEE',
    specialty: 'Enclave ATECC608B, firmas ECDSA, biometría y prevención de espionaje',
    avatarIcon: '🔐',
    color: '#f59e0b', // amber
    status: 'active',
  },
];

export const INITIAL_SWARM_MESSAGES: SwarmChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'swarm',
    text: '¡Saludos! Somos el **Enjambre de Agentes de Hedera Shield Protocol (HSP)**. Estamos aquí para asesorarte, explicarte por qué y para qué sirve cada función de la app, cómo operarla y ayudarte a ejecutar acciones de blindaje físico y gobernanza confidencial.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    agentContributions: [
      {
        agentId: 'agent-coordinator',
        agentName: 'Coordinador HSP',
        agentRole: 'Guía General',
        snippet: 'HSP resuelve el problema del espionaje físico en juntas ejecutivas, mesas OTC y comités DAO combinando hardware físico y Hedera Hashgraph.',
      },
      {
        agentId: 'agent-depin',
        agentName: 'Centinela DePIN',
        agentRole: 'Hardware IoT',
        snippet: 'Nuestros nodos ESP32 saturan diafragmas de micrófonos a 25 kHz y emiten Voice-Mix para anular grabadoras ocultas.',
      },
      {
        agentId: 'agent-hedera',
        agentName: 'Hashgraph Oracle',
        agentRole: 'Hedera HCS',
        snippet: 'Cada segundo de blindaje queda atestado en HCS (Topic 0.0.654321) con tarifa fija de $0.0001 USD.',
      },
      {
        agentId: 'agent-crypto',
        agentName: 'Guardián Cripto',
        agentRole: 'Seguridad TEE',
        snippet: 'Las operaciones críticas como liberar fondos o apagar el blindaje exigen validación biométrica TouchID/FaceID.',
      },
    ],
    suggestedActions: [
      {
        label: '¿Por qué y para qué sirve HSP?',
        actionType: 'view_blueprint',
        iconName: 'BookOpen',
      },
      {
        label: 'Activar Blindaje en Nodos',
        actionType: 'navigate_nodes',
        iconName: 'Shield',
      },
      {
        label: 'Ver Espectrograma en Vivo',
        actionType: 'navigate_sensors',
        iconName: 'Activity',
      },
    ],
  },
];

export class SwarmService {
  /**
   * Send a query to the swarm. Attempts server-side proxy route with Gemini 2.5/3.8 Flash,
   * with complete multi-agent deliberative fallback.
   */
  static async querySwarm(
    userQuery: string,
    currentNodes: IoTShieldNode[],
    currentEscrows: EscrowSession[]
  ): Promise<SwarmChatMessage> {
    const activeNodes = currentNodes.filter((n) => n.status === 'SHIELDING_ACTIVE').length;
    const tamperedNodes = currentNodes.filter((n) => !n.tamperCircuitSecure).length;

    // Try server API first
    try {
      const response = await fetch('/api/swarm-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          context: {
            activeNodes,
            totalNodes: currentNodes.length,
            tamperedNodes,
            escrowsCount: currentEscrows.length,
            nodesSummary: currentNodes.map(n => ({ id: n.id, name: n.name, status: n.status, freq: n.ultrasonicFrequencyKhz, db: n.acousticDecibels })),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'swarm',
            text: data.text,
            timestamp: new Date(),
            agentContributions: data.agentContributions || [
              {
                agentId: 'agent-coordinator',
                agentName: 'Coordinador HSP',
                agentRole: 'Guía General',
                snippet: 'Respuesta consolidada por el Enjambre para tu requerimiento.',
              },
            ],
            suggestedActions: data.suggestedActions || this.generateSuggestedActions(userQuery),
          };
        }
      }
    } catch {
      // Fallback to local intelligent knowledge-base
    }

    // Local multi-agent deliberation engine
    return this.generateDeliberativeResponse(userQuery, currentNodes, currentEscrows);
  }

  private static generateSuggestedActions(query: string) {
    const lower = query.toLowerCase();
    if (lower.includes('nodo') || lower.includes('blindaje') || lower.includes('activar') || lower.includes('apagar')) {
      return [
        { label: 'Ir al Panel de Nodos', actionType: 'navigate_nodes' as const, iconName: 'Cpu' },
        { label: 'Alternar Blindaje Acústico', actionType: 'toggle_all_shields' as const, iconName: 'Radio' },
      ];
    }
    if (lower.includes('sensor') || lower.includes('espectro') || lower.includes('frecuencia') || lower.includes('decibel')) {
      return [
        { label: 'Ver Espectro y Sensores', actionType: 'navigate_sensors' as const, iconName: 'Activity' },
        { label: 'Simular Detección de Micrófono', actionType: 'simulate_eavesdropping' as const, iconName: 'Mic' },
      ];
    }
    if (lower.includes('hedera') || lower.includes('escrow') || lower.includes('hcs') || lower.includes('contrato') || lower.includes('fondos')) {
      return [
        { label: 'Gestionar Escrow y HCS', actionType: 'navigate_hedera' as const, iconName: 'Zap' },
        { label: 'Ver Código HederaShieldEscrow', actionType: 'view_blueprint' as const, iconName: 'FileCode' },
      ];
    }
    return [
      { label: 'Explorar Nodos ESP32', actionType: 'navigate_nodes' as const, iconName: 'Cpu' },
      { label: 'Revisar Sensores en Vivo', actionType: 'navigate_sensors' as const, iconName: 'Activity' },
    ];
  }

  private static generateDeliberativeResponse(
    query: string,
    nodes: IoTShieldNode[],
    escrows: EscrowSession[]
  ): SwarmChatMessage {
    const lower = query.toLowerCase();
    const activeNodes = nodes.filter((n) => n.status === 'SHIELDING_ACTIVE').length;

    // Topic: Why and what is HSP for?
    if (lower.includes('por que') || lower.includes('para que') || lower.includes('que es') || lower.includes('proposito')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'swarm',
        text: `### 🛡️ ¿Por qué y para qué sirve Hedera Shield Protocol (HSP)?

**1. El Problema que Resolvemos:**
En reuniones de juntas directivas, comités de tesorería DAO y mesas OTC, los teléfonos móviles y micrófonos espías ocultos filtran acuerdos confidenciales. Los bloqueadores analógicos antiguos no ofrecen ninguna prueba de que el ambiente estuvo realmente seguro.

**2. Cómo lo Resuelve HSP:**
- **Blindaje Físico Edge**: Dispositivos IoT (ESP32-S3 + TEE) emiten ultrasonido a **25.0 kHz** modulado con ruido acústico *Voice-Mix*, saturando mecánicamente los diafragmas MEMS de smartphones y grabadoras sin molestar el oído humano.
- **Prueba Criptográfica en Hedera (PoPS)**: El procesador seguro firma telemetría que se envía a **Hedera Consensus Service (HCS Topic 0.0.654321)** con tarifa fija de **$0.0001 USD**.
- **Ejecución de Smart Contracts**: Los fondos en garantía (*Escrow*) solo se liberan si la red Hedera certifica que la reunión transcurrió bajo blindaje físico ininterrumpido.`,
        timestamp: new Date(),
        agentContributions: [
          {
            agentId: 'agent-coordinator',
            agentName: 'Coordinador HSP',
            agentRole: 'Guía General',
            snippet: 'Une el mundo físico (hardware DePIN) con el mundo digital (consenso inmutable Hedera) para gobernanza de alto valor.',
          },
          {
            agentId: 'agent-depin',
            agentName: 'Centinela DePIN',
            agentRole: 'Hardware IoT',
            snippet: 'La modulación a 25 kHz sobreexcita el convertidor analógico-digital de los micrófonos espías, grabando solo estática inservible.',
          },
          {
            agentId: 'agent-hedera',
            agentName: 'Hashgraph Oracle',
            agentRole: 'Hedera HCS',
            snippet: 'La finalidad aBFT de 3 a 5 segundos de Hedera permite auditar en tiempo real la validez del ambiente.',
          },
        ],
        suggestedActions: [
          { label: 'Ir a Nodos de Blindaje', actionType: 'navigate_nodes', iconName: 'Cpu' },
          { label: 'Ver Espectrograma 25kHz', actionType: 'navigate_sensors', iconName: 'Activity' },
          { label: 'Ver Blueprint Técnico', actionType: 'view_blueprint', iconName: 'FileCode' },
        ],
      };
    }

    // Topic: How to use & activate
    if (lower.includes('como se usa') || lower.includes('como activo') || lower.includes('como funciona') || lower.includes('instrucciones')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'swarm',
        text: `### 🧭 Guía Operativa Paso a Paso: Cómo usar la App

1. **Panel de Nodos (Pestaña Nodos)**:
   - Visualiza tus dispositivos ESP32 TEE conectados (${activeNodes} de ${nodes.length} actualmente activos).
   - Pulsa **"ACTIVAR"** en cualquier nodo para iniciar la emisión ultrasónica a 25 kHz.
   - Para apagarlo, el sistema te solicitará **autenticación biométrica** para evitar sabotajes accidentales.

2. **Panel de Sensores (Pestaña Sensores)**:
   - Observa el espectrograma en tiempo real con la onda portadora de 25 kHz y la envolvente *Voice-Mix*.
   - Revisa la presión acústica en decibeles (dB SPL) y el estado del sensor óptico anti-sabotaje.

3. **Gobernanza y Escrow (Pestaña Hedera)**:
   - Crea un acuerdo confidencial con depósito en HBAR.
   - Cuando termine la reunión, pulsa **"Liberar Fondos (releaseEscrow)"**; el contrato valida con HCS que el ambiente estuvo blindado antes de transferir los fondos.

4. **Autenticación Biométrica y Google**:
   - Pulsa el icono de perfil en la barra superior para vincular tu cuenta de Google.
   - Usa el candado biométrico para proteger la app contra accesos no autorizados.`,
        timestamp: new Date(),
        agentContributions: [
          {
            agentId: 'agent-depin',
            agentName: 'Centinela DePIN',
            agentRole: 'Hardware IoT',
            snippet: 'Puedes ajustar la frecuencia PWM de 20 a 40 kHz en el modal de configuración de cada nodo.',
          },
          {
            agentId: 'agent-crypto',
            agentName: 'Guardián Cripto',
            agentRole: 'Biometría',
            snippet: 'La validación biométrica se enlaza con el enclave ATECC608B para autorizar transacciones críticas.',
          },
        ],
        suggestedActions: [
          { label: 'Ir al Panel de Nodos', actionType: 'navigate_nodes', iconName: 'Cpu' },
          { label: 'Ver Espectrograma', actionType: 'navigate_sensors', iconName: 'Activity' },
          { label: 'Simular Intento de Espionaje', actionType: 'simulate_eavesdropping', iconName: 'Mic' },
        ],
      };
    }

    // Topic: Escrow & Hedera
    if (lower.includes('escrow') || lower.includes('hedera') || lower.includes('hcs') || lower.includes('contrato') || lower.includes('fondos') || lower.includes('hbar')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'swarm',
        text: `### ⚡ Arquitectura Hedera: Consensus Service (HCS) & Smart Contracts

- **Hedera Consensus Service (Topic 0.0.654321)**:
  Los microcontroladores ESP32 firman con su chip criptográfico ATECC608B cada latido (*heartbeat*) que certifica que el jammer está emitiendo a 25 kHz. Hedera le asigna una marca temporal de consenso (*consensus timestamp*) inmutable con tarifa predecible de **$0.0001 USD**.

- **Smart Contract Escrow (HederaShieldEscrow.sol)**:
  Contiene la función \`verifyPhysicalShielding(sessionId, timestamp, signature)\`. Antes de que el beneficiario reciba los HBAR, el contrato verifica criptográficamente que la firma provenga de la dirección del hardware confiable (\`trustedHardwareSigner\`).

- **Sesiones Actuales**: Dispones de **${escrows.length} acuerdos** registrados en la red.`,
        timestamp: new Date(),
        agentContributions: [
          {
            agentId: 'agent-hedera',
            agentName: 'Hashgraph Oracle',
            agentRole: 'Hedera HCS',
            snippet: 'A diferencia de Ethereum o Solana, en Hedera las tarifas no tienen picos de gas volátiles: enviar telemetría IoT cuesta una fracción de centavo fija.',
          },
          {
            agentId: 'agent-crypto',
            agentName: 'Guardián Cripto',
            agentRole: 'Seguridad TEE',
            snippet: 'Las firmas son ECDSA secp256k1 compatibles con EVM nativo en Hedera Smart Contract Service.',
          },
        ],
        suggestedActions: [
          { label: 'Abrir Panel Hedera & Escrow', actionType: 'navigate_hedera', iconName: 'Zap' },
          { label: 'Ver Código HederaShieldEscrow.sol', actionType: 'view_blueprint', iconName: 'FileCode' },
        ],
      };
    }

    // Default intelligent guidance
    return {
      id: `msg-${Date.now()}`,
      sender: 'swarm',
      text: `El Enjambre ha analizado tu consulta sobre **"${query}"**:

Actualmente tienes **${nodes.length} nodos ESP32 TEE** configurados (${activeNodes} en emisión activa a 25 kHz) y **${escrows.length} acuerdos en custodia**.

¿Qué acción deseas que el Enjambre coordine contigo?
1. **Activar o calibrar** la modulación ultrasónica y *Voice-Mix* en las salas de reunión.
2. **Revisar las métricas de sensores** (presión sonora en dB, temperatura del chip, circuito anti-sabotaje).
3. **Validar un depósito en custodia** con Hedera Consensus Service.
4. **Probar el simulador de incidentes** para comprobar la respuesta ante micrófonos espías.`,
      timestamp: new Date(),
      agentContributions: [
        {
          agentId: 'agent-coordinator',
          agentName: 'Coordinador HSP',
          agentRole: 'Guía General',
          snippet: 'Indícame qué operación necesitas y te guiaré o la ejecutaré directamente.',
        },
        {
          agentId: 'agent-depin',
          agentName: 'Centinela DePIN',
          agentRole: 'Hardware IoT',
          snippet: 'Los transductores piezoeléctricos se encuentran calibrados y operando.',
        },
      ],
      suggestedActions: [
        { label: 'Ver Nodos de Blindaje', actionType: 'navigate_nodes', iconName: 'Cpu' },
        { label: 'Ver Espectrograma de Sensores', actionType: 'navigate_sensors', iconName: 'Activity' },
        { label: 'Simular Ataque de Espionaje', actionType: 'simulate_eavesdropping', iconName: 'Mic' },
      ],
    };
  }
}
