export type NodeStatus = 'SHIELDING_ACTIVE' | 'IDLE' | 'ALERT_TAMPER' | 'MUTED' | 'OFFLINE';

export interface IoTShieldNode {
  id: string;
  name: string;
  location: string;
  status: NodeStatus;
  ultrasonicFrequencyKhz: number;
  pwmDutyCycle: number; // 0 to 255 (128 is 50%)
  voiceMixActive: boolean;
  voiceMixLevel: number; // 0 to 100%
  acousticDecibels: number;
  tamperCircuitSecure: boolean;
  batteryPercent: number;
  powerSource: 'BATTERY' | 'AC_MAINS';
  temperatureCelsius: number;
  teeChipModel: string;
  teeAddress: string;
  lastHcsTimestamp: string;
  lastHcsSequence: number;
  totalHeartbeatsEmitted: number;
  firmwareVersion: string;
  ipAddress: string;
}

export interface HCSMessage {
  sequenceNumber: number;
  consensusTimestamp: string;
  topicId: string;
  runningHash: string;
  deviceId: string;
  status: 'ACTIVE' | 'TAMPER_ALERT' | 'HEARTBEAT' | 'SILENCE';
  frequency: number;
  signature: string;
  feeUSD: number;
  createdTime: Date;
}

export interface EscrowSession {
  sessionId: string;
  title: string;
  initiator: string;
  beneficiary: string;
  amountHbar: number;
  isShieldedVerified: boolean;
  executed: boolean;
  createdTimestamp: number;
  verifiedTimestamp: number | null;
  topicProofSequence: number | null;
  contractAddress: string;
}

export type NotificationType = 'critical' | 'shield' | 'hcs' | 'hardware' | 'auth';

export interface NotificationItem {
  id: string;
  timestamp: Date;
  title: string;
  message: string;
  type: NotificationType;
  deviceId?: string;
  sensorType?: 'ultrasonic' | 'mems' | 'tamper' | 'thermal' | 'battery' | 'tee';
  read: boolean;
}

export interface BiometricAuthState {
  isAuthenticated: boolean;
  biometricMethod: 'fingerprint' | 'faceid' | 'passkey';
  isEnrolled: boolean;
  requireForCriticalActions: boolean;
  lastAuthTime: Date | null;
}
