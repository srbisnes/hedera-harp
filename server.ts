import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API if key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI();
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with environment key:', err);
  }
}

// Swarm Chat API Endpoint
app.post('/api/swarm-chat', async (req, res) => {
  const { query, context } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // If Gemini API is available and initialized, generate intelligent response
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `Eres el Enjambre de Agentes de Hedera Shield Protocol (HSP), una infraestructura DePIN de contraespionaje acústico y gobernanza confidencial sobre Hedera Hashgraph.
El sistema combina:
1. Hardware Edge: ESP32-S3 con enclave seguro TEE (ATECC608B), transductores piezoeléctricos ultrasónicos a 25.0 kHz para saturar diafragmas de micrófonos MEMS y enmascaramiento Voice-Mix (ruido rosa).
2. Hedera Consensus Service (HCS Topic 0.0.654321): telemetría de latidos (heartbeats) firmada con ECDSA, timestamp inmutable y costo fijo de $0.0001 USD.
3. Hedera Smart Contract Service (HSCS): Contrato HederaShieldEscrow.sol que solo libera depósitos de HBAR si HCS certifica un entorno físicamente blindado (Proof-of-Physical-Shielding, PoPS).
4. Seguridad móvil: Autenticación con Google OAuth, candado biométrico (TouchID/FaceID) y centro de notificaciones en tiempo real para sensores.

Contexto actual de la app:
- Nodos activos: ${context?.activeNodes || 0} de ${context?.totalNodes || 3}
- Nodos con alerta de sabotaje: ${context?.tamperedNodes || 0}
- Acuerdos Escrow activos: ${context?.escrowsCount || 2}

Tu misión es asesorar y guiar al usuario en español respondiendo:
- Por qué y para qué sirve HSP.
- Cómo se usa cada función (panel de nodos, frecuencia PWM, sensores, escrow, biometría, Google login).
- De qué manera protege reuniones de juntas directivas, mesas OTC y comités DAO.
- Recomendar las próximas acciones operativas dentro de la app.
Estructura tu respuesta de forma atractiva con Markdown, destacando aportes de los agentes:
- 🤖 Coordinador HSP
- 🛡️ Centinela DePIN
- ⚡ Hashgraph Oracle
- 🔐 Guardián Cripto`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
        },
      });

      const responseText = response.text || '';

      return res.json({
        text: responseText,
        agentContributions: [
          {
            agentId: 'agent-coordinator',
            agentName: 'Coordinador HSP',
            agentRole: 'Guía General',
            snippet: 'Análisis sintetizado del Enjambre de Agentes con inteligencia generativa en tiempo real.',
          },
          {
            agentId: 'agent-depin',
            agentName: 'Centinela DePIN',
            agentRole: 'Hardware IoT',
            snippet: 'Parámetros de transductores ultrasónicos y sensores verificados.',
          },
        ],
      });
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back to local swarm deliberation:', apiError);
    }
  }

  // Fallback response if API key is absent or errored
  return res.json({
    text: `El Enjambre de Agentes de Hedera Shield Protocol ha recibido tu consulta sobre: **"${query}"**.

### 🛡️ Propósito y Funcionalidad:
Hedera Shield Protocol (HSP) fue creado para garantizar que las deliberaciones ejecutivas, negociaciones OTC y votaciones multisig de DAOs ocurran en un ambiente físicamente blindado contra micrófonos espías y grabadoras de smartphones.

1. **¿Por qué sirve?**
   Los bloqueadores analógicos comunes no proveen pruebas. HSP emite atestaciones firmadas criptográficamente a **Hedera Consensus Service (HCS)** a **$0.0001 USD**, generando una prueba matemática inmutable de que nadie pudo grabar la conversación.

2. **¿Para qué sirve?**
   Protege secretos comerciales, transacciones financieras y votos de gobernanza. El contrato inteligente \`HederaShieldEscrow.sol\` solo liquida fondos si la atestación física de la sala se mantuvo ininterrumpida.

3. **¿Cómo se usa?**
   - Accede a la pestaña **Nodos** para activar la emisión a 25 kHz.
   - Revisa en **Sensores** el espectrograma en tiempo real y el circuito anti-sabotaje.
   - En **Hedera**, gestiona los depósitos de fondos condicionados a la privacidad física.
   - Usa tu cuenta de **Google** y el sensor biométrico para autorizar transacciones críticas.`,
    agentContributions: [
      {
        agentId: 'agent-coordinator',
        agentName: 'Coordinador HSP',
        agentRole: 'Guía General',
        snippet: 'Soporte y asesoramiento operativo en tiempo real disponible para todos los módulos.',
      },
      {
        agentId: 'agent-hedera',
        agentName: 'Hashgraph Oracle',
        agentRole: 'Hedera HCS',
        snippet: 'Hedera Consensus Topic 0.0.654321 validando latidos criptográficos.',
      },
    ],
  });
});

// User profile API mock/support
app.get('/api/auth/google/status', (_req, res) => {
  res.json({
    provider: 'google',
    status: 'ready',
    clientId: 'google-depin-hedera-shield.apps.googleusercontent.com',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hedera Shield Protocol Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
