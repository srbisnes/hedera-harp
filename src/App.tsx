/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  IoTShieldNode, HCSMessage, EscrowSession, NotificationItem 
} from './types/protocol';
import { UserProfile, SwarmChatMessage } from './types/auth';
import { 
  INITIAL_NODES, INITIAL_HCS_MESSAGES, INITIAL_ESCROWS, INITIAL_NOTIFICATIONS,
  generateRandomHex, sendBrowserPushNotification
} from './services/mockHardwareHCS';
import { GoogleAuthService } from './services/googleAuthService';
import { SwarmService, INITIAL_SWARM_MESSAGES } from './services/swarmService';
import { BiometricService } from './services/biometricService';
import { playTechChirp, vibrateDevice } from './utils/audioHaptic';

import { MobileFrame } from './components/MobileFrame';
import { HeaderBar } from './components/HeaderBar';
import { BottomNav, TabKey } from './components/BottomNav';
import { BiometricModal } from './components/BiometricModal';
import { SimulatorModal } from './components/SimulatorModal';
import { GoogleLoginModal } from './components/auth/GoogleLoginModal';

import { DeviceList } from './components/nodes/DeviceList';
import { DeviceDetailModal } from './components/nodes/DeviceDetailModal';
import { AddDeviceModal } from './components/nodes/AddDeviceModal';

import { EscrowAndHCSPanel } from './components/hedera/EscrowAndHCSPanel';
import { SensorDashboard } from './components/sensors/SensorDashboard';
import { SwarmChatPanel } from './components/swarm/SwarmChatPanel';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { BlueprintViewer } from './components/blueprint/BlueprintViewer';

export default function App() {
  const [nodes, setNodes] = useState<IoTShieldNode[]>(INITIAL_NODES);
  const [hcsMessages, setHcsMessages] = useState<HCSMessage[]>(INITIAL_HCS_MESSAGES);
  const [escrows, setEscrows] = useState<EscrowSession[]>(INITIAL_ESCROWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Authentication & Swarm State
  const [currentUser, setCurrentUser] = useState<UserProfile>(GoogleAuthService.getUser());
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [swarmMessages, setSwarmMessages] = useState<SwarmChatMessage[]>(INITIAL_SWARM_MESSAGES);
  const [isSwarmLoading, setIsSwarmLoading] = useState(false);

  // Navigation & Frame
  const [activeTab, setActiveTab] = useState<TabKey>('nodes');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Modals & Selected Node
  const [selectedNode, setSelectedNode] = useState<IoTShieldNode | null>(null);
  const [selectedNodeIdForSensors, setSelectedNodeIdForSensors] = useState<string>(INITIAL_NODES[0].id);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Biometrics
  const [isBiometricLocked, setIsBiometricLocked] = useState(false);
  const [biometricPrompt, setBiometricPrompt] = useState<{
    isOpen: boolean;
    title: string;
    onSuccess: () => void;
    canCancel: boolean;
  }>({
    isOpen: false,
    title: '',
    onSuccess: () => {},
    canCancel: true,
  });

  // Background real-time simulation interval (Heartbeat & sensor fluctuations)
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate acoustic dB slightly
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.status === 'SHIELDING_ACTIVE') {
            const delta = (Math.random() - 0.5) * 1.2;
            const newDb = Math.max(35, Math.min(85, parseFloat((node.acousticDecibels + delta).toFixed(1))));
            return {
              ...node,
              acousticDecibels: newDb,
            };
          }
          return node;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Request Biometric Action helper
  const handleRequestBiometricAction = (title: string, action: () => void) => {
    const authState = BiometricService.getState();
    if (!authState.requireForCriticalActions) {
      action();
      return;
    }
    setBiometricPrompt({
      isOpen: true,
      title,
      onSuccess: () => {
        setBiometricPrompt((prev) => ({ ...prev, isOpen: false }));
        action();
      },
      canCancel: true,
    });
  };

  // Toggle Shielding on a node
  const handleToggleShield = (nodeId: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          const isActivating = node.status !== 'SHIELDING_ACTIVE';
          playTechChirp(isActivating ? 'shield-on' : 'shield-off');

          const newStatus = isActivating ? 'SHIELDING_ACTIVE' : 'IDLE';
          const newDuty = isActivating ? 128 : 0;

          // Push real-time notification
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
            title: isActivating ? 'Blindaje Ultrasónico Activado' : 'Blindaje Detenido',
            message: isActivating
              ? `${node.name} inició emisión a 25.0 kHz para saturar grabadoras.`
              : `${node.name} pasó a modo pasivo de escucha.`,
            type: 'shield',
            deviceId: node.id,
            sensorType: 'ultrasonic',
            read: false,
          };
          setNotifications((n) => [newNotif, ...n]);

          return {
            ...node,
            status: newStatus,
            pwmDutyCycle: newDuty,
          };
        }
        return node;
      })
    );
  };

  // Toggle all shields
  const handleToggleAllShields = () => {
    handleRequestBiometricAction('Activar Máxima Protección en Todos los Nodos', () => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          status: 'SHIELDING_ACTIVE',
          pwmDutyCycle: 128,
          voiceMixActive: true,
          voiceMixLevel: 70,
        }))
      );
      playTechChirp('shield-on');
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        timestamp: new Date(),
        title: 'Blindaje Total Desplegado',
        message: 'Todos los nodos ESP32 se encuentran saturando a 25 kHz con Voice-Mix activo.',
        type: 'shield',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    });
  };

  // Update hardware params
  const handleUpdateParams = (
    nodeId: string,
    freq: number,
    duty: number,
    voiceMix: boolean,
    voiceLevel: number
  ) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ultrasonicFrequencyKhz: freq,
            pwmDutyCycle: duty,
            voiceMixActive: voiceMix,
            voiceMixLevel: voiceLevel,
          };
        }
        return node;
      })
    );

    const updatedNode = nodes.find((n) => n.id === nodeId);
    if (updatedNode) {
      setSelectedNode({
        ...updatedNode,
        ultrasonicFrequencyKhz: freq,
        pwmDutyCycle: duty,
        voiceMixActive: voiceMix,
        voiceMixLevel: voiceLevel,
      });
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Parámetros ESP32 Sincronizados',
      message: `Frecuencia PWM actualizada a ${freq.toFixed(1)} kHz con Voice-Mix al ${voiceLevel}%.`,
      type: 'hardware',
      deviceId: nodeId,
      sensorType: 'ultrasonic',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Release Escrow
  const handleReleaseEscrow = (sessionId: string) => {
    setEscrows((prev) =>
      prev.map((escrow) => {
        if (escrow.sessionId === sessionId) {
          playTechChirp('biometric-success');
          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
            title: 'Fondos Escrow Liberados (HSCS)',
            message: `Se transfirieron ${escrow.amountHbar.toLocaleString()} HBAR a ${escrow.beneficiary} tras verificar el Proof-of-Shielding en Hedera HCS.`,
            type: 'hcs',
            read: false,
          };
          setNotifications((n) => [notif, ...n]);
          sendBrowserPushNotification('Escrow Ejecutado en Hedera', `${escrow.amountHbar} HBAR transferidos`);
          return {
            ...escrow,
            executed: true,
          };
        }
        return escrow;
      })
    );
  };

  // Create Escrow
  const handleCreateEscrow = (title: string, beneficiary: string, amount: number) => {
    const newSession: EscrowSession = {
      sessionId: generateRandomHex(64),
      title,
      initiator: currentUser.hederaAccountId || '0.0.481923',
      beneficiary,
      amountHbar: amount,
      isShieldedVerified: true,
      executed: false,
      createdTimestamp: Date.now(),
      verifiedTimestamp: Date.now(),
      topicProofSequence: hcsMessages[0]?.sequenceNumber || 10429,
      contractAddress: '0.0.984210 (HederaShieldEscrow)',
    };
    setEscrows((prev) => [newSession, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Nuevo Escrow Condicionado Creado',
      message: `${amount.toLocaleString()} HBAR bloqueados. Requiere registro TEE continuo en Topic HCS 0.0.654321.`,
      type: 'hcs',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  // Manual HCS Heartbeat
  const handleEmitManualHeartbeat = () => {
    const nextSeq = (hcsMessages[0]?.sequenceNumber || 10428) + 1;
    const nowTimestamp = `${(Date.now() / 1000).toFixed(0)}.${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const newMsg: HCSMessage = {
      sequenceNumber: nextSeq,
      consensusTimestamp: nowTimestamp,
      topicId: '0.0.654321',
      runningHash: generateRandomHex(16) + '...f91a',
      deviceId: 'SHIELD-NODE-01',
      status: 'ACTIVE',
      frequency: 25.0,
      signature: generateRandomHex(24) + '...aa8b',
      feeUSD: 0.0001,
      createdTime: new Date(),
    };

    setHcsMessages((prev) => [newMsg, ...prev.slice(0, 19)]);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === 'SHIELD-NODE-01'
          ? {
              ...n,
              lastHcsSequence: nextSeq,
              lastHcsTimestamp: nowTimestamp,
              totalHeartbeatsEmitted: n.totalHeartbeatsEmitted + 1,
            }
          : n
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Prueba TEE Registrada en HCS',
      message: `Hedera Consensus validó secuencia #${nextSeq} con marca temporal inmutable.`,
      type: 'hcs',
      deviceId: 'SHIELD-NODE-01',
      sensorType: 'tee',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  // Simulation: Eavesdropping Attempt
  const handleSimulateEavesdropping = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === 'SHIELD-NODE-01'
          ? {
              ...n,
              acousticDecibels: 78.6,
              voiceMixActive: true,
              voiceMixLevel: 90,
            }
          : n
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: '¡ALERTA! Intento de Escucha Detectado',
      message: 'El sniffer MEMS en Sala Alpha detectó presión acústica anómala. Voice-Mix maximizado al 90% para proteger la conversación.',
      type: 'critical',
      deviceId: 'SHIELD-NODE-01',
      sensorType: 'mems',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
    sendBrowserPushNotification('¡ALERTA DE ESPIONAJE!', 'Micrófono o grabadora detectada en Sala Alpha');
  };

  // Simulation: Tamper
  const handleSimulateTamper = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === 'SHIELD-NODE-01'
          ? {
              ...n,
              tamperCircuitSecure: false,
              status: 'ALERT_TAMPER',
            }
          : n
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: '¡SABOTAJE! Carcasa de Nodo Abierta',
      message: 'El circuito óptico de SHIELD-NODE-01 fue vulnerado. Claves de cifrado TEE congeladas preventivamente.',
      type: 'critical',
      deviceId: 'SHIELD-NODE-01',
      sensorType: 'tamper',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
    sendBrowserPushNotification('¡SABOTAJE FÍSICO!', 'Carcasa abierta en nodo de blindaje');
  };

  // Simulation: Battery Drain
  const handleSimulateBatteryDrain = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === 'SHIELD-NODE-03'
          ? {
              ...n,
              batteryPercent: 12,
              powerSource: 'BATTERY',
            }
          : n
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Batería Crítica en Pod Portátil',
      message: 'SHIELD-NODE-03 restante: 12%. Conecte a fuente de alimentación AC.',
      type: 'critical',
      deviceId: 'SHIELD-NODE-03',
      sensorType: 'battery',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  // Reset to normal
  const handleResetAllNormal = () => {
    setNodes(INITIAL_NODES);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Sistema Restaurado a Estado Seguro',
      message: 'Todos los sensores recalibrados y enclaves TEE en línea.',
      type: 'shield',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  // Add new device
  const handleAddNode = (newNode: IoTShieldNode) => {
    setNodes((prev) => [newNode, ...prev]);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      title: 'Nuevo Nodo ESP32 Enlazado',
      message: `${newNode.name} registrado con éxito en Hedera Consensus Topic 0.0.654321.`,
      type: 'hardware',
      deviceId: newNode.id,
      sensorType: 'tee',
      read: false,
    };
    setNotifications((n) => [notif, ...n]);
  };

  // Swarm Chat Handler
  const handleSendSwarmMessage = async (query: string) => {
    const userMsg: SwarmChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setSwarmMessages((prev) => [...prev, userMsg]);
    setIsSwarmLoading(true);

    try {
      const swarmReply = await SwarmService.querySwarm(query, nodes, escrows);
      setSwarmMessages((prev) => [...prev, swarmReply]);
    } catch {
      // In case of error
    } finally {
      setIsSwarmLoading(false);
    }
  };

  // Swarm Action Execution Handler
  const handleExecuteSwarmAction = (actionType: string) => {
    switch (actionType) {
      case 'navigate_nodes':
        setActiveTab('nodes');
        break;
      case 'navigate_sensors':
        setActiveTab('sensors');
        break;
      case 'navigate_hedera':
        setActiveTab('hedera');
        break;
      case 'view_blueprint':
        setActiveTab('blueprint');
        break;
      case 'toggle_all_shields':
        handleToggleAllShields();
        break;
      case 'simulate_eavesdropping':
        handleSimulateEavesdropping();
        break;
      case 'simulate_tamper':
        handleSimulateTamper();
        break;
      default:
        break;
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const activeShieldsCount = nodes.filter((n) => n.status === 'SHIELDING_ACTIVE').length;
  const hasCriticalAlert = notifications.some((n) => !n.read && n.type === 'critical');

  return (
    <>
      <MobileFrame isPhoneFrame={isPhoneFrame}>
        {/* Mobile Header Bar */}
        <HeaderBar
          isBiometricLocked={isBiometricLocked}
          onToggleLock={() => {
            if (isBiometricLocked) {
              setBiometricPrompt({
                isOpen: true,
                title: 'Desbloquear Panel de Control HSP',
                onSuccess: () => {
                  setIsBiometricLocked(false);
                  setBiometricPrompt((p) => ({ ...p, isOpen: false }));
                },
                canCancel: true,
              });
            } else {
              setIsBiometricLocked(true);
            }
          }}
          unreadCount={unreadNotifsCount}
          onOpenNotifications={() => setActiveTab('notifications')}
          onOpenSimulator={() => setShowSimulatorModal(true)}
          onOpenGoogleAuth={() => setShowGoogleModal(true)}
          onOpenBlueprint={() => setActiveTab('blueprint')}
          currentUser={currentUser}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          activeShieldsCount={activeShieldsCount}
        />

        {/* Locked Screen Overlay if user locked the panel */}
        {isBiometricLocked ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="font-display font-bold text-lg text-slate-100">
              Panel Protegido por Biometría
            </h2>
            <p className="text-xs text-slate-400 max-w-xs">
              La gestión de nodos IoT y contratos en Hedera requiere autenticación TouchID / FaceID.
            </p>
            <button
              onClick={() => {
                setBiometricPrompt({
                  isOpen: true,
                  title: 'Desbloquear Panel de Control HSP',
                  onSuccess: () => {
                    setIsBiometricLocked(false);
                    setBiometricPrompt((p) => ({ ...p, isOpen: false }));
                  },
                  canCancel: true,
                });
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50"
            >
              Autenticar con Biometría
            </button>
          </div>
        ) : (
          /* Main Views */
          <div className="pt-3 min-h-[calc(100vh-140px)] flex flex-col">
            {activeTab === 'nodes' && (
              <DeviceList
                nodes={nodes}
                onSelectNode={(node) => setSelectedNode(node)}
                onToggleShield={handleToggleShield}
                onAddDevice={() => setShowAddDeviceModal(true)}
                onRequestBiometricAction={handleRequestBiometricAction}
              />
            )}

            {activeTab === 'hedera' && (
              <EscrowAndHCSPanel
                messages={hcsMessages}
                escrows={escrows}
                nodes={nodes}
                onReleaseEscrow={handleReleaseEscrow}
                onCreateEscrow={handleCreateEscrow}
                onEmitManualHeartbeat={handleEmitManualHeartbeat}
                onRequestBiometricAction={handleRequestBiometricAction}
              />
            )}

            {activeTab === 'sensors' && (
              <SensorDashboard
                nodes={nodes}
                selectedNodeId={selectedNodeIdForSensors}
                onSelectNodeId={(id) => setSelectedNodeIdForSensors(id)}
                onRequestBiometricAction={handleRequestBiometricAction}
              />
            )}

            {activeTab === 'swarm' && (
              <SwarmChatPanel
                messages={swarmMessages}
                onSendMessage={handleSendSwarmMessage}
                isLoading={isSwarmLoading}
                onExecuteAction={handleExecuteSwarmAction}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationDrawer
                notifications={notifications}
                onMarkAllRead={() => {
                  playTechChirp('click');
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
                onClearAll={() => {
                  playTechChirp('click');
                  setNotifications([]);
                }}
                onRequestBiometricAction={handleRequestBiometricAction}
              />
            )}

            {activeTab === 'blueprint' && <BlueprintViewer />}
          </div>
        )}

        {/* Bottom Navigation Dock */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          unreadCount={unreadNotifsCount}
          hasAlert={hasCriticalAlert}
        />
      </MobileFrame>

      {/* Google Login & Profile Modal */}
      <GoogleLoginModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        currentUser={currentUser}
        onUserChange={(updated) => setCurrentUser(updated)}
        onRequestBiometricAction={handleRequestBiometricAction}
      />

      {/* Device Detail & Config Modal */}
      <DeviceDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onToggleShield={handleToggleShield}
        onUpdateParams={handleUpdateParams}
        onRequestBiometricAction={handleRequestBiometricAction}
      />

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={showAddDeviceModal}
        onClose={() => setShowAddDeviceModal(false)}
        onAddNode={handleAddNode}
        onRequestBiometricAction={handleRequestBiometricAction}
      />

      {/* Real-time Simulator Modal */}
      <SimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
        onSimulateEavesdropping={handleSimulateEavesdropping}
        onSimulateTamper={handleSimulateTamper}
        onSimulateHcsCommit={handleEmitManualHeartbeat}
        onSimulateBatteryDrain={handleSimulateBatteryDrain}
        onResetAllNormal={handleResetAllNormal}
      />

      {/* Biometric Scan Prompt Modal */}
      <BiometricModal
        isOpen={biometricPrompt.isOpen}
        actionTitle={biometricPrompt.title}
        onSuccess={biometricPrompt.onSuccess}
        onCancel={() => setBiometricPrompt((p) => ({ ...p, isOpen: false }))}
        canCancel={biometricPrompt.canCancel}
      />
    </>
  );
}
