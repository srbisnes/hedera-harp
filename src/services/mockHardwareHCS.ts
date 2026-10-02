import { IoTShieldNode, HCSMessage, EscrowSession, NotificationItem } from '../types/protocol';
import { playTechChirp } from '../utils/audioHaptic';

export const INITIAL_NODES: IoTShieldNode[] = [
  {
    id: 'SHIELD-NODE-01',
    name: 'Sala Alpha (War Room Ejecutiva)',
    location: 'Piso 14 · Sede Corporativa',
    status: 'SHIELDING_ACTIVE',
    ultrasonicFrequencyKhz: 25.0,
    pwmDutyCycle: 128, // 50%
    voiceMixActive: true,
    voiceMixLevel: 65,
    acousticDecibels: 48.5,
    tamperCircuitSecure: true,
    batteryPercent: 96,
    powerSource: 'AC_MAINS',
    temperatureCelsius: 29.2,
    teeChipModel: 'ESP32-S3 + ATECC608B TEE',
    teeAddress: '0x9E71F42b781297D87b134Cbeff4270C347bbAa41',
    lastHcsTimestamp: '1775135600.412891002',
    lastHcsSequence: 10428,
    totalHeartbeatsEmitted: 10428,
    firmwareVersion: 'v1.4.2-TEE',
    ipAddress: '192.168.10.45',
  },
  {
    id: 'SHIELD-NODE-02',
    name: 'Mesa OTC & Custodia Cripto',
    location: 'Búnker B2 · Trading Desk',
    status: 'SHIELDING_ACTIVE',
    ultrasonicFrequencyKhz: 25.5,
    pwmDutyCycle: 135,
    voiceMixActive: false,
    voiceMixLevel: 0,
    acousticDecibels: 52.1,
    tamperCircuitSecure: true,
    batteryPercent: 84,
    powerSource: 'AC_MAINS',
    temperatureCelsius: 31.4,
    teeChipModel: 'ESP32-S3 Secure Element',
    teeAddress: '0x1A2B3C4D5E6F708192a3b4c5d6e7f8091a2b3c4d',
    lastHcsTimestamp: '1775135598.110294005',
    lastHcsSequence: 8940,
    totalHeartbeatsEmitted: 8940,
    firmwareVersion: 'v1.4.2-TEE',
    ipAddress: '192.168.10.82',
  },
  {
    id: 'SHIELD-NODE-03',
    name: 'Pod Portátil DAO Governance',
    location: 'Móvil · Maletín Blindado #03',
    status: 'IDLE',
    ultrasonicFrequencyKhz: 24.8,
    pwmDutyCycle: 0,
    voiceMixActive: false,
    voiceMixLevel: 0,
    acousticDecibels: 36.4,
    tamperCircuitSecure: true,
    batteryPercent: 68,
    powerSource: 'BATTERY',
    temperatureCelsius: 24.5,
    teeChipModel: 'ESP32-S3 Micro TEE Shield',
    teeAddress: '0x43DeF918aC9b71e8092305886617aDeFA945C992',
    lastHcsTimestamp: '1775135520.890000001',
    lastHcsSequence: 3120,
    totalHeartbeatsEmitted: 3120,
    firmwareVersion: 'v1.4.0-PORTABLE',
    ipAddress: '10.0.4.15',
  },
];

export const INITIAL_HCS_MESSAGES: HCSMessage[] = [
  {
    sequenceNumber: 10428,
    consensusTimestamp: '1775135600.412891002',
    topicId: '0.0.654321',
    runningHash: '0x3f7b2a9e108d44c8...c1e9',
    deviceId: 'SHIELD-NODE-01',
    status: 'ACTIVE',
    frequency: 25.0,
    signature: '0x8d904b77c3a0980...910a1b',
    feeUSD: 0.0001,
    createdTime: new Date(Date.now() - 3000),
  },
  {
    sequenceNumber: 10427,
    consensusTimestamp: '1775135590.210450001',
    topicId: '0.0.654321',
    runningHash: '0x12a9e4b77d88c001...ff22',
    deviceId: 'SHIELD-NODE-02',
    status: 'ACTIVE',
    frequency: 25.5,
    signature: '0x4f128bc9910d55e...e88102',
    feeUSD: 0.0001,
    createdTime: new Date(Date.now() - 13000),
  },
  {
    sequenceNumber: 10426,
    consensusTimestamp: '1775135580.090120000',
    topicId: '0.0.654321',
    runningHash: '0x718b2c4d9e001a44...bb71',
    deviceId: 'SHIELD-NODE-01',
    status: 'ACTIVE',
    frequency: 25.0,
    signature: '0x99a01f5c4b31278...aa9012',
    feeUSD: 0.0001,
    createdTime: new Date(Date.now() - 23000),
  },
];

export const INITIAL_ESCROWS: EscrowSession[] = [
  {
    sessionId: '0x7a4b8c91d2e3f405162738495a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7',
    title: 'Acuerdo de Fusión M&A Confidencial (50,000 HBAR)',
    initiator: '0.0.481923 (Consejo Directivo)',
    beneficiary: '0.0.771204 (Representante Legal)',
    amountHbar: 50000,
    isShieldedVerified: true,
    executed: false,
    createdTimestamp: Date.now() - 3600000,
    verifiedTimestamp: Date.now() - 600000,
    topicProofSequence: 10420,
    contractAddress: '0.0.984210 (HederaShieldEscrow)',
  },
  {
    sessionId: '0x9c3d1e2f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f',
    title: 'Desembolso OTC Tesorería DAO (120,000 HBAR)',
    initiator: '0.0.510928 (Multisig Key)',
    beneficiary: '0.0.619022 (Liquidity Provider)',
    amountHbar: 120000,
    isShieldedVerified: false,
    executed: false,
    createdTimestamp: Date.now() - 900000,
    verifiedTimestamp: null,
    topicProofSequence: null,
    contractAddress: '0.0.984210 (HederaShieldEscrow)',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    title: 'Barrera Ultrasónica Activa (25 kHz)',
    message: 'SHIELD-NODE-01 emite modulación acústica contínua en Sala Alpha. Diafragmas MEMS saturados.',
    type: 'shield',
    deviceId: 'SHIELD-NODE-01',
    sensorType: 'ultrasonic',
    read: false,
  },
  {
    id: 'notif-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    title: 'Timestamp Consenso HCS Validado',
    message: 'Hedera Consensus Topic 0.0.654321 registró prueba TEE #10428 con tarifa fija de $0.0001 USD.',
    type: 'hcs',
    deviceId: 'SHIELD-NODE-01',
    sensorType: 'tee',
    read: false,
  },
  {
    id: 'notif-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    title: 'Sensor Anti-Sabotaje OK',
    message: 'Chasis seguro y cerrado. Criptoprocesador ATECC608B sincronizado con clave TEE en hardware.',
    type: 'hardware',
    deviceId: 'SHIELD-NODE-02',
    sensorType: 'tamper',
    read: true,
  },
];

// Helper to generate a realistic signature
export function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Request real browser Notification permission if supported
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch {
      return false;
    }
  }
  return false;
}

export function sendBrowserPushNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch {
      // Ignored
    }
  }
}
