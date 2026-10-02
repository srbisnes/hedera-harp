import React, { useState } from 'react';
import { IoTShieldNode } from '../../types/protocol';
import { 
  X, Shield, ShieldAlert, Cpu, Wifi, Radio, Sliders, Volume2, 
  Lock, Copy, Check, Battery, Zap, AlertTriangle 
} from 'lucide-react';
import { playTechChirp, vibrateDevice } from '../../utils/audioHaptic';

interface DeviceDetailModalProps {
  node: IoTShieldNode | null;
  onClose: () => void;
  onToggleShield: (nodeId: string) => void;
  onUpdateParams: (nodeId: string, freq: number, duty: number, voiceMix: boolean, voiceLevel: number) => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({
  node,
  onClose,
  onToggleShield,
  onUpdateParams,
  onRequestBiometricAction,
}) => {
  const [copied, setCopied] = useState(false);
  const [freq, setFreq] = useState(node?.ultrasonicFrequencyKhz || 25.0);
  const [duty, setDuty] = useState(node?.pwmDutyCycle || 128);
  const [voiceMix, setVoiceMix] = useState(node?.voiceMixActive || false);
  const [voiceLevel, setVoiceLevel] = useState(node?.voiceMixLevel || 50);

  if (!node) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(node.teeAddress);
    setCopied(true);
    playTechChirp('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyChanges = () => {
    playTechChirp('click');
    onUpdateParams(node.id, freq, duty, voiceMix, voiceLevel);
  };

  const isShielding = node.status === 'SHIELDING_ACTIVE';

  const handleToggleShieldClick = () => {
    if (isShielding) {
      // Deactivating active acoustic counter-surveillance requires biometric authorization!
      onRequestBiometricAction(
        `Desactivar Blindaje Acústico en ${node.name}`,
        () => onToggleShield(node.id)
      );
    } else {
      onToggleShield(node.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isShielding 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                : node.status === 'ALERT_TAMPER'
                ? 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {isShielding ? <Shield className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                {node.name}
              </h3>
              <p className="text-xs text-slate-400">{node.location} · {node.id}</p>
            </div>
          </div>
          <button
            onClick={() => {
              playTechChirp('click');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="my-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              {isShielding ? (
                <>
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="absolute w-5 h-5 rounded-full bg-emerald-400/30 animate-ping" />
                </>
              ) : (
                <span className="w-3 h-3 rounded-full bg-amber-400" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                {isShielding ? 'Blindaje Ultrasónico Activo' : 'Nodo en Modo En Espera'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {isShielding ? 'Saturación MEMS 25kHz continua' : 'Monitoreo acústico pasivo'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleShieldClick}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm ${
              isShielding
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isShielding ? 'Desactivar (Biométrico)' : 'Activar Blindaje'}
          </button>
        </div>

        {/* Hardware & TEE Specs */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Enclave Seguro TEE & Hedera Mirror
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                ECDSA Secp256k1
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Chip / Elemento Seguro:</span>
                <span className="text-slate-200 font-mono">{node.teeChipModel}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Dirección Pública TEE:</span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800"
                >
                  <span>{node.teeAddress.slice(0, 8)}...{node.teeAddress.slice(-6)}</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Topic Hedera HCS:</span>
                <span className="text-slate-200 font-mono">0.0.654321</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Último Sequence HCS:</span>
                <span className="text-emerald-400 font-mono">#{node.lastHcsSequence}</span>
              </div>
            </div>
          </div>

          {/* Physical & Acoustic Parameters */}
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Ajuste de Modulación Ultrasónica & Audio
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ESP32 PWM Channel 0
              </span>
            </div>

            {/* Ultrasonic Frequency slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Frecuencia Ultrasónica (PWM Pin 25)</span>
                <span className="text-cyan-300 font-mono font-bold">{freq.toFixed(1)} kHz</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="40.0"
                step="0.1"
                value={freq}
                onChange={(e) => setFreq(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>20 kHz (Audible Edge)</span>
                <span>25 kHz (Óptimo MEMS Jamming)</span>
                <span>40 kHz (Alta Frecuencia)</span>
              </div>
            </div>

            {/* PWM Duty Cycle */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Potencia de Transductor (Duty Cycle)</span>
                <span className="text-cyan-300 font-mono font-bold">{Math.round((duty / 255) * 100)}% ({duty}/255)</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                step="1"
                value={duty}
                onChange={(e) => setDuty(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Voice-Mix Pink Noise */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-200">Enmascaramiento Voice-Mix (Pink Noise)</span>
                </div>
                <button
                  onClick={() => setVoiceMix(!voiceMix)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    voiceMix ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    voiceMix ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {voiceMix && (
                <div className="mt-2 pl-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 text-[11px]">Intensidad de Mezcla Vocal</span>
                    <span className="text-cyan-300 font-mono text-[11px]">{voiceLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={voiceLevel}
                    onChange={(e) => setVoiceLevel(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleApplyChanges}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Aplicar Parámetros a Firmware ESP32
            </button>
          </div>

          {/* Sensor Diagnostics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Presión Acústica</span>
                <span className="text-base font-bold font-mono text-slate-200">{node.acousticDecibels} dB</span>
              </div>
              <Radio className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Circuito Anti-Tamper</span>
                <span className={`text-xs font-bold font-mono ${
                  node.tamperCircuitSecure ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {node.tamperCircuitSecure ? 'SELLADO' : '¡VULNERADO!'}
                </span>
              </div>
              {node.tamperCircuitSecure ? (
                <Lock className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
