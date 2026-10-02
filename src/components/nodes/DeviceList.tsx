import React, { useState } from 'react';
import { IoTShieldNode } from '../../types/protocol';
import { 
  Shield, ShieldAlert, Cpu, Radio, Battery, Zap, AlertTriangle, 
  Plus, CheckCircle2, ChevronRight, Sliders, Wifi, Activity
} from 'lucide-react';
import { playTechChirp, vibrateDevice } from '../../utils/audioHaptic';

interface DeviceListProps {
  nodes: IoTShieldNode[];
  onSelectNode: (node: IoTShieldNode) => void;
  onToggleShield: (nodeId: string) => void;
  onAddDevice: () => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  nodes,
  onSelectNode,
  onToggleShield,
  onAddDevice,
  onRequestBiometricAction,
}) => {
  const activeCount = nodes.filter((n) => n.status === 'SHIELDING_ACTIVE').length;
  const tamperAlertCount = nodes.filter((n) => !n.tamperCircuitSecure || n.status === 'ALERT_TAMPER').length;

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Metric Row - Clean unboxed text layout */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Red DePIN Acústica Hedera
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            HCS aBFT Finality ~3s
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-1">
          <div>
            <span className="text-[11px] text-slate-400 block">Nodos Blindaje</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-display text-slate-100">{activeCount}</span>
              <span className="text-xs text-slate-500 font-mono">/ {nodes.length}</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">25 kHz Activo</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Tarifa por HCS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-display text-emerald-400">$0.0001</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">USD Fijo (Hedera)</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Anti-Sabotaje</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-bold font-display ${tamperAlertCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {tamperAlertCount > 0 ? `${tamperAlertCount} ALERTA` : '100%'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {tamperAlertCount > 0 ? 'Chasis abierto' : 'Chasis Sellado'}
            </span>
          </div>
        </div>
      </div>

      {/* Nodes Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-display font-bold text-base text-slate-100">
            Nodos ESP32 TEE Shield
          </h3>
          <p className="text-xs text-slate-400">
            Transductores ultrasónicos y atestación criptográfica
          </p>
        </div>

        <button
          onClick={() => {
            playTechChirp('click');
            onAddDevice();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Vincular Nodo</span>
        </button>
      </div>

      {/* Nodes List */}
      <div className="space-y-3">
        {nodes.map((node) => {
          const isShielding = node.status === 'SHIELDING_ACTIVE';
          const isTampered = !node.tamperCircuitSecure || node.status === 'ALERT_TAMPER';

          return (
            <div
              key={node.id}
              className={`p-4 rounded-3xl bg-slate-900 border transition-all duration-200 relative overflow-hidden ${
                isTampered
                  ? 'border-rose-500/60 bg-rose-950/20 shadow-rose-950/40 shadow-lg'
                  : isShielding
                  ? 'border-emerald-500/30 hover:border-emerald-500/50 shadow-emerald-950/20 shadow-md'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Ultrasonic active ripple ring in background */}
              {isShielding && (
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-emerald-500/20 animate-ultrasonic pointer-events-none" />
              )}

              <div className="flex items-start justify-between">
                <div 
                  onClick={() => {
                    playTechChirp('click');
                    onSelectNode(node);
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg ${
                      isTampered
                        ? 'bg-rose-500/20 text-rose-400'
                        : isShielding
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isTampered ? (
                        <ShieldAlert className="w-4 h-4 animate-bounce" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-100 hover:text-cyan-300 transition-colors">
                      {node.name}
                    </h4>
                  </div>

                  {/* Clean unboxed metadata line */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>{node.location}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-cyan-400/90">{node.id}</span>
                  </div>
                </div>

                {/* Quick Toggle Button */}
                <button
                  onClick={() => {
                    if (isShielding) {
                      onRequestBiometricAction(
                        `Desactivar Blindaje Acústico en ${node.name}`,
                        () => onToggleShield(node.id)
                      );
                    } else {
                      onToggleShield(node.id);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                    isShielding
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                  aria-label="Alternar blindaje"
                >
                  <Radio className={`w-3.5 h-3.5 ${isShielding ? 'animate-pulse' : ''}`} />
                  <span>{isShielding ? 'BLINDADO' : 'ACTIVAR'}</span>
                </button>
              </div>

              {/* Real-time telemetry indicators */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Frecuencia</span>
                  <span className="text-cyan-300 font-bold mt-0.5 block">
                    {node.ultrasonicFrequencyKhz.toFixed(1)}k
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Ruido MEMS</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">
                    {node.acousticDecibels} dB
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">Batería</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    {node.powerSource === 'AC_MAINS' ? (
                      <Zap className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Battery className="w-3 h-3 text-cyan-400" />
                    )}
                    <span className="text-slate-200 font-bold">{node.batteryPercent}%</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block">HCS Heartbeat</span>
                  <span className="text-emerald-400 font-bold mt-0.5 block">
                    #{node.lastHcsSequence}
                  </span>
                </div>
              </div>

              {/* Footer action to open detailed view */}
              <div 
                onClick={() => {
                  playTechChirp('click');
                  onSelectNode(node);
                }}
                className="mt-2 flex items-center justify-between text-[11px] text-slate-400 hover:text-cyan-300 pt-1 cursor-pointer transition-colors"
              >
                <span className="font-mono flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  TEE: {node.teeChipModel}
                </span>
                <div className="flex items-center gap-0.5 font-medium">
                  <span>Configurar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
