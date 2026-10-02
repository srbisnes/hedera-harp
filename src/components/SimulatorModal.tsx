import React from 'react';
import { X, Mic, AlertTriangle, ShieldCheck, BatteryCharging, Zap } from 'lucide-react';
import { playTechChirp } from '../utils/audioHaptic';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateEavesdropping: () => void;
  onSimulateTamper: () => void;
  onSimulateHcsCommit: () => void;
  onSimulateBatteryDrain: () => void;
  onResetAllNormal: () => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateEavesdropping,
  onSimulateTamper,
  onSimulateHcsCommit,
  onSimulateBatteryDrain,
  onResetAllNormal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Simulador de Eventos IoT & Red
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prueba la respuesta en tiempo real de los sensores y la red Hedera
            </p>
          </div>
          <button
            onClick={() => {
              playTechChirp('click');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Cerrar simulador"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 my-4">
          <button
            onClick={() => {
              playTechChirp('alert');
              onSimulateEavesdropping();
              onClose();
            }}
            className="flex items-start gap-3 p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-amber-500/40 transition-all group"
          >
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-400 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-200 block group-hover:text-amber-300">
                1. Detección de Micrófono Espía (MEMS Sniffer)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Eleva la presión acústica dB, intensifica el Voice-Mix y emite notificación crítica.
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              playTechChirp('alert');
              onSimulateTamper();
              onClose();
            }}
            className="flex items-start gap-3 p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-rose-500/40 transition-all group"
          >
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-200 block group-hover:text-rose-300">
                2. Intento de Sabotaje Físico (Anti-Tamper)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Simula apertura del chasis del nodo. Activa sirena, bloquea el TEE y alerta a la red.
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              playTechChirp('hcs-commit');
              onSimulateHcsCommit();
              onClose();
            }}
            className="flex items-start gap-3 p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-cyan-500/40 transition-all group"
          >
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-200 block group-hover:text-cyan-300">
                3. Transmitir Heartbeat a Hedera HCS
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                ESP32 firma y registra una nueva prueba criptográfica en el Topic 0.0.654321.
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              playTechChirp('click');
              onSimulateBatteryDrain();
              onClose();
            }}
            className="flex items-start gap-3 p-3 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-amber-500/40 transition-all group"
          >
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-400 group-hover:scale-105 transition-transform">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-200 block group-hover:text-amber-300">
                4. Caída de Batería en Nodo Móvil
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Simula corte de alimentación y pasa a batería de respaldo (alerta de autonomía).
              </span>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={() => {
              playTechChirp('biometric-success');
              onResetAllNormal();
              onClose();
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-4"
          >
            Restaurar todos los nodos a estado seguro
          </button>
          <span className="text-[11px] font-mono text-slate-500">
            HSP Edge Testnet
          </span>
        </div>
      </div>
    </div>
  );
};
