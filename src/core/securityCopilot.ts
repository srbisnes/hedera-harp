/**
 * HARP Autonomous Security Copilot — core decision helpers.
 * Deterministic ranking + action suggestions; LLM can expand narratives later.
 */

export type ThreatPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface CopilotContext {
  activeNodes: number;
  totalNodes: number;
  tamperedNodes: number;
  highSeverityEvents: number;
  lastAnchorMode: 'mock' | 'live' | 'unknown';
  openEscrows: number;
}

export interface RankedThreat {
  id: string;
  priority: ThreatPriority;
  title: string;
  reason: string;
  score: number;
}

export type CopilotAction =
  | 'isolate_node'
  | 'anchor_evidence'
  | 'review_incident'
  | 'notify_operator'
  | 'pause_escrow'
  | 'request_biometric'
  | 'noop';

export interface SuggestedAction {
  action: CopilotAction;
  label: string;
  priority: ThreatPriority;
  autoExecutable: boolean;
}

export function rankThreats(ctx: CopilotContext): RankedThreat[] {
  const threats: RankedThreat[] = [];

  if (ctx.tamperedNodes > 0) {
    threats.push({
      id: 'tamper',
      priority: 'critical',
      title: 'Integridad de hardware comprometida',
      reason: `${ctx.tamperedNodes} nodo(s) con señal de saboteo o TEE inválido.`,
      score: 100 + ctx.tamperedNodes * 10,
    });
  }

  if (ctx.highSeverityEvents > 0) {
    threats.push({
      id: 'high-sev',
      priority: ctx.highSeverityEvents >= 3 ? 'high' : 'medium',
      title: 'Eventos de alta severidad sin cerrar',
      reason: `${ctx.highSeverityEvents} evento(s) HIGH/CRITICAL pendientes de revisión.`,
      score: 70 + ctx.highSeverityEvents * 5,
    });
  }

  const offline = Math.max(0, ctx.totalNodes - ctx.activeNodes);
  if (offline > 0) {
    threats.push({
      id: 'offline',
      priority: offline >= 3 ? 'high' : 'medium',
      title: 'Nodos offline o sin heartbeat',
      reason: `${offline} de ${ctx.totalNodes} nodos no reportan actividad.`,
      score: 40 + offline * 8,
    });
  }

  if (ctx.openEscrows > 0 && ctx.tamperedNodes > 0) {
    threats.push({
      id: 'escrow-risk',
      priority: 'high',
      title: 'Escrow abierto con evidencia de riesgo',
      reason: `${ctx.openEscrows} sesión(es) de escrow sin verificación bajo alertas de integridad.`,
      score: 85,
    });
  }

  if (ctx.lastAnchorMode === 'mock') {
    threats.push({
      id: 'mock-hcs',
      priority: 'info',
      title: 'HCS en modo demo',
      reason: 'La evidencia no está anclada en testnet/mainnet. Configura credenciales Hedera.',
      score: 10,
    });
  }

  return threats.sort((a, b) => b.score - a.score);
}

export function suggestActions(ctx: CopilotContext): SuggestedAction[] {
  const actions: SuggestedAction[] = [];
  const threats = rankThreats(ctx);

  if (threats.some((t) => t.id === 'tamper')) {
    actions.push({
      action: 'isolate_node',
      label: 'Aislar nodos con tamper',
      priority: 'critical',
      autoExecutable: false,
    });
    actions.push({
      action: 'anchor_evidence',
      label: 'Anclar evidencia de integridad en HCS',
      priority: 'critical',
      autoExecutable: ctx.lastAnchorMode === 'live',
    });
    actions.push({
      action: 'notify_operator',
      label: 'Notificar al operador SOC',
      priority: 'critical',
      autoExecutable: true,
    });
  }

  if (threats.some((t) => t.id === 'escrow-risk')) {
    actions.push({
      action: 'pause_escrow',
      label: 'Pausar escrow hasta verificación',
      priority: 'high',
      autoExecutable: false,
    });
    actions.push({
      action: 'request_biometric',
      label: 'Requerir autorización biométrica',
      priority: 'high',
      autoExecutable: false,
    });
  }

  if (threats.some((t) => t.id === 'high-sev' || t.id === 'offline')) {
    actions.push({
      action: 'review_incident',
      label: 'Abrir revisión de incidente',
      priority: 'high',
      autoExecutable: false,
    });
  }

  if (actions.length === 0) {
    actions.push({
      action: 'noop',
      label: 'Sin acciones urgentes',
      priority: 'info',
      autoExecutable: true,
    });
  }

  return actions;
}

export function buildCopilotBriefing(ctx: CopilotContext): string {
  const threats = rankThreats(ctx);
  if (threats.length === 0 || (threats.length === 1 && threats[0].id === 'mock-hcs')) {
    const mode = ctx.lastAnchorMode === 'live' ? 'HCS live' : 'modo demo';
    return `Estado nominal: ${ctx.activeNodes}/${ctx.totalNodes} nodos activos, sin alertas de integridad. Evidencia en ${mode}. Sin acciones urgentes.`;
  }

  const top = threats.slice(0, 3);
  const lines = top.map((t, i) => `${i + 1}. [${t.priority.toUpperCase()}] ${t.title} — ${t.reason}`);
  const actions = suggestActions(ctx)
    .filter((a) => a.action !== 'noop')
    .slice(0, 3)
    .map((a) => a.label)
    .join('; ');

  return (
    `Resumen operativo HARP:\n` +
    `Nodos: ${ctx.activeNodes}/${ctx.totalNodes} activos · Tamper: ${ctx.tamperedNodes} · Eventos altos: ${ctx.highSeverityEvents}\n` +
    lines.join('\n') +
    (actions ? `\nAcciones sugeridas: ${actions}.` : '')
  );
}
