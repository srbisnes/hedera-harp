import express, { type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const APP_ORIGIN = process.env.APP_ORIGIN || `http://localhost:${PORT}`;
const AI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

// Minimal security headers for the demo server. A production edge should add a full CSP/HSTS policy.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Simple in-memory limiter for the demo endpoint. Use a shared gateway/Redis limiter in production.
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const bucket = requestBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      requestBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (bucket.count >= limit) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
    bucket.count += 1;
    return next();
  };
}

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

type SwarmContext = {
  activeNodes?: number;
  totalNodes?: number;
  tamperedNodes?: number;
  escrowsCount?: number;
};

function normalizeQuery(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 2000);
}

function normalizeContext(value: unknown): SwarmContext {
  if (!value || typeof value !== 'object') return {};
  const context = value as Record<string, unknown>;
  return {
    activeNodes: Number.isFinite(Number(context.activeNodes)) ? Number(context.activeNodes) : 0,
    totalNodes: Number.isFinite(Number(context.totalNodes)) ? Number(context.totalNodes) : 0,
    tamperedNodes: Number.isFinite(Number(context.tamperedNodes)) ? Number(context.tamperedNodes) : 0,
    escrowsCount: Number.isFinite(Number(context.escrowsCount)) ? Number(context.escrowsCount) : 0,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'harp-api', version: '0.1.0' });
});

app.post('/api/swarm-chat', rateLimit(30, 60_000), async (req, res) => {
  const query = normalizeQuery(req.body?.query);
  const context = normalizeContext(req.body?.context);

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: query,
        config: {
          systemInstruction:
            'You are the HARP security-console assistant. Explain the architecture, telemetry, incident workflow, evidence anchoring and Hedera integration boundaries. Treat hardware, authentication, biometrics, HCS and smart contracts as simulated unless the user explicitly provides evidence of a live integration. Never claim that the MVP is audited, production-ready, or capable of guaranteeing physical security. Answer in Spanish.',
        },
      });

      const responseText = response.text?.trim();
      if (responseText) {
        return res.json({
          text: responseText,
          mode: 'ai',
          context,
        });
      }
    } catch (error) {
      console.warn('AI request failed; using deterministic fallback.', error);
    }
  }

  return res.json({
    mode: 'demo',
    context,
    text:
      `HARP recibió tu consulta: **"${query}"**.\\n\\n` +
      `Estado demo: ${context.activeNodes || 0}/${context.totalNodes || 0} nodos activos, ` +
      `${context.tamperedNodes || 0} alertas de integridad y ${context.escrowsCount || 0} sesiones de evidencia.\\n\\n` +
      'El panel permite explorar telemetría, simulación de incidentes y el flujo de evidencia orientado a Hedera. Las integraciones de hardware, autenticación y blockchain deben conectarse y auditarse antes de producción.',
    agentContributions: [
      {
        agentId: 'agent-coordinator',
        agentName: 'HARP Coordinator',
        agentRole: 'Security Operations',
        snippet: 'Resume el estado y guía la operación del MVP.',
      },
      {
        agentId: 'agent-hedera',
        agentName: 'Hedera Evidence',
        agentRole: 'Consensus & Evidence',
        snippet: 'Explica el límite entre simulación y evidencia realmente anclada en Hedera.',
      },
    ],
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
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
    console.log(`HARP server listening on 0.0.0.0:${PORT}`);
    console.log(`Configured application origin: ${APP_ORIGIN}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start HARP:', error);
  process.exit(1);
});
