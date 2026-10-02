export type ThreatSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityEventInput {
  deviceId: string;
  eventType: string;
  observedAt: string;
  integrityValid: boolean;
  anomalyScore: number;
}

export interface SecurityEvent extends SecurityEventInput {
  id: string;
  severity: ThreatSeverity;
  evidenceHash: string;
}

export function classifySeverity(anomalyScore: number, integrityValid: boolean): ThreatSeverity {
  if (!integrityValid) return 'CRITICAL';
  if (anomalyScore >= 0.9) return 'HIGH';
  if (anomalyScore >= 0.7) return 'MEDIUM';
  if (anomalyScore >= 0.4) return 'LOW';
  return 'INFO';
}

export function validateSecurityEvent(input: SecurityEventInput): string[] {
  const errors: string[] = [];
  if (!input.deviceId.trim()) errors.push('deviceId is required');
  if (!input.eventType.trim()) errors.push('eventType is required');
  if (!input.observedAt || Number.isNaN(Date.parse(input.observedAt))) errors.push('observedAt must be an ISO date');
  if (!Number.isFinite(input.anomalyScore) || input.anomalyScore < 0 || input.anomalyScore > 1) errors.push('anomalyScore must be between 0 and 1');
  return errors;
}

// Deterministic MVP evidence identifier. Production should use SHA-256 or equivalent.
export function createEvidenceHash(input: SecurityEventInput): string {
  const canonical = [input.deviceId.trim(), input.eventType.trim(), new Date(input.observedAt).toISOString(), input.integrityValid ? '1' : '0', input.anomalyScore.toFixed(6)].join('|');
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

export function createSecurityEvent(input: SecurityEventInput): SecurityEvent {
  const errors = validateSecurityEvent(input);
  if (errors.length > 0) throw new Error(errors.join('; '));
  return { ...input, id: 'evt-' + createEvidenceHash(input).slice(-8), severity: classifySeverity(input.anomalyScore, input.integrityValid), evidenceHash: createEvidenceHash(input) };
}