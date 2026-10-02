import React, { useState } from 'react';
import { X, Cpu, Wifi, Radio, Shield, CheckCircle2 } from 'lucide-react';
import { IoTShieldNode } from '../../types/protocol';
import { playTechChirp } from '../../utils/audioHaptic';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (node: IoTShieldNode) => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddNode,
  onRequestBiometricAction,
}) => {
  const [name, setName] = useState('Sala de Reunión Privada (Escrow)');
  const [location, setLocation] = useState('Piso 8 · Oficina Confidencial');
  const [chipModel, setChipModel] = useState('ESP32-S3-WROOM-1 + ATECC608B');
  const [scanning, setScanning] = useState(false);
  const [discovered, setDiscovered] = useState(false);

  if (!isOpen) return null;

  const handleScanBLE = () => {
    setScanning(true);
    playTechChirp('click');
    setTimeout(() => {
      setScanning(false);
      setDiscovered(true);
      playTechChirp('biometric-success');
    }, 1500);
  };

  const handleRegister = () => {
    onRequestBiometricAction(
      'Autorizar Registro Criptográfico de Nuevo Nodo ESP32',
      () => {
        const idNum = Math.floor(Math.random() * 89 + 10);
        const newNode: IoTShieldNode = {
          id: `SHIELD-NODE-${idNum}`,
          name,
          location,
          status: 'SHIELDING_ACTIVE',
          ultrasonicFrequencyKhz: 25.0,
          pwmDutyCycle: 128,
          voiceMixActive: true,
          voiceMixLevel: 50,
          acousticDecibels: 46.0,
          tamperCircuitSecure: true,
          batteryPercent: 100,
          powerSource: 'AC_MAINS',
          temperatureCelsius: 27.5,
          teeChipModel: chipModel,
          teeAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          lastHcsTimestamp: (Date.now() / 1000).toFixed(9),
          lastHcsSequence: 10500,
          totalHeartbeatsEmitted: 1,
          firmwareVersion: 'v1.4.2-TEE',
          ipAddress: `192.168.10.${100 + idNum}`,
        };
        onAddNode(newNode);
        onClose();
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-slate-100">
              Vincular Nodo ESP32 Shield
            </h3>
          </div>
          <button
            onClick={() => {
              playTechChirp('click');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-4">
          {!discovered ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
                <Wifi className={`w-8 h-8 ${scanning ? 'animate-pulse' : ''}`} />
              </div>
              <h4 className="font-display font-bold text-slate-200 text-sm">
                Búsqueda BLE / Wi-Fi Mesh
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Encienda el ESP32-S3. La baliza emitirá telemetría de descubrimiento cifrada.
              </p>
              <button
                onClick={handleScanBLE}
                disabled={scanning}
                className="mt-4 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all"
              >
                {scanning ? 'Escaneando Frecuencias...' : 'Escanear Dispositivos Cercanos'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-semibold text-emerald-300 block">
                    ¡Hardware ESP32-S3 TEE Detectado!
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    MAC: 7C:DF:A1:88:23:BC · RSSI: -42 dBm
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Nombre del Nodo / Sala
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Ubicación Física
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Pin PWM Ultrasónico:</span>
                  <span className="text-cyan-400">GPIO 25 (25 kHz)</span>
                </div>
                <div className="flex justify-between">
                  <span>Enclave Seguro:</span>
                  <span className="text-slate-200">{chipModel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Topic Hedera HCS:</span>
                  <span className="text-emerald-400">0.0.654321</span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all"
              >
                Firmar y Registrar en Hedera Hashgraph
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
