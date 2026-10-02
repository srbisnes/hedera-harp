import React, { useState, useEffect, useRef } from 'react';
import { IoTShieldNode } from '../../types/protocol';
import { 
  Activity, Radio, Mic, ShieldAlert, Lock, Battery, Thermometer, 
  Volume2, AlertTriangle, CheckCircle2, RefreshCw, Sliders 
} from 'lucide-react';
import { playTechChirp } from '../../utils/audioHaptic';

interface SensorDashboardProps {
  nodes: IoTShieldNode[];
  selectedNodeId: string;
  onSelectNodeId: (id: string) => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({
  nodes,
  selectedNodeId,
  onSelectNodeId,
  onRequestBiometricAction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const [alertThresholdDb, setAlertThresholdDb] = useState(65);

  // Live Canvas Waveform & Ultrasonic Spectrum Renderer
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear dark background
      ctx.fillStyle = '#070b12';
      ctx.fillRect(0, 0, width, height);

      // Draw frequency grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Ultrasonic 25kHz Carrier Wave (Cyan)
      const isShielding = activeNode?.status === 'SHIELDING_ACTIVE';
      ctx.beginPath();
      ctx.strokeStyle = isShielding ? '#06b6d4' : '#64748b';
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        // High frequency carrier wave at 25kHz + modulated noise
        const freqMultiplier = isShielding ? 0.12 : 0.03;
        const amplitude = isShielding ? 25 : 6;
        const noise = isShielding ? (Math.random() - 0.5) * 8 : 0;
        const y = height / 2 + Math.sin(x * freqMultiplier + phase) * amplitude + noise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // If Voice-Mix is active, draw Pink Noise masking envelope (Emerald / Amber)
      if (activeNode?.voiceMixActive) {
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x++) {
          const pinkNoise = (Math.sin(x * 0.02 + phase * 0.5) + Math.cos(x * 0.05 - phase)) * 14;
          const y = height / 2 + pinkNoise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 25kHz frequency marker line
      const markerX = width * 0.65;
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(markerX, 0);
      ctx.lineTo(markerX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('25.0 kHz Jamming', markerX + 6, 18);

      phase += isShielding ? 0.35 : 0.08;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeNode]);

  if (!activeNode) return null;

  const isShielding = activeNode.status === 'SHIELDING_ACTIVE';
  const isTampered = !activeNode.tamperCircuitSecure || activeNode.status === 'ALERT_TAMPER';

  return (
    <div className="space-y-4 pb-20">
      {/* Node Selector Row */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">Seleccionar Nodo:</span>
        <div className="flex gap-1.5 overflow-x-auto">
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                playTechChirp('click');
                onSelectNodeId(n.id);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                n.id === activeNode.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {n.id}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Spectrum Analyzer Canvas Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-slate-100">
              Espectrograma Acústico & Ultrasónico (Live)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {isShielding ? 'Saturación MEMS Activa' : 'Standby Pasivo'}
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={480}
            height={130}
            className="w-full h-32 block"
          />

          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Onda Portadora 25 kHz
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Voice-Mix Masking
            </span>
            <span className="text-amber-400">Pico 85-92 dB SPL</span>
          </div>
        </div>
      </div>

      {/* Sensor Array Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Sensor 1: Ultrasonic Transducers */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xs text-slate-200">
                Transductores Ultrasónicos
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isShielding ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {isShielding ? 'EMITIENDO' : 'INACTIVO'}
            </span>
          </div>

          <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
            <div className="flex justify-between">
              <span>Frecuencia PWM:</span>
              <span className="text-cyan-300 font-bold">{activeNode.ultrasonicFrequencyKhz} kHz</span>
            </div>
            <div className="flex justify-between">
              <span>Duty Cycle:</span>
              <span className="text-slate-200">{activeNode.pwmDutyCycle} / 255 (50%)</span>
            </div>
            <div className="flex justify-between">
              <span>Diafragmas Afectados:</span>
              <span className="text-emerald-400">MEMS / Condensador 100%</span>
            </div>
          </div>
        </div>

        {/* Sensor 2: MEMS Acoustic Sniffer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
                <Mic className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xs text-slate-200">
                Sensor Sniffer MEMS (I2S)
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400">
              {activeNode.acousticDecibels > alertThresholdDb ? 'RUIDO ALTO' : 'NORMAL'}
            </span>
          </div>

          <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
            <div className="flex justify-between items-center">
              <span>Presión Acústica:</span>
              <span className="text-base font-bold text-slate-100">{activeNode.acousticDecibels} dB</span>
            </div>
            {/* Decibel progress bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  activeNode.acousticDecibels > alertThresholdDb
                    ? 'bg-rose-500'
                    : activeNode.acousticDecibels > 55
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (activeNode.acousticDecibels / 100) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Umbral Alerta: {alertThresholdDb} dB</span>
              <span className="text-slate-500">Máx 120 dB</span>
            </div>
          </div>
        </div>

        {/* Sensor 3: Anti-Tamper Physical Security */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isTampered ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
              }`}>
                {isTampered ? <AlertTriangle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <span className="font-display font-bold text-xs text-slate-200">
                Sensor Anti-Sabotaje
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isTampered ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isTampered ? 'SABOTAJE DETECTADO' : 'SELLADO'}
            </span>
          </div>

          <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
            <div className="flex justify-between">
              <span>Circuito Óptico de Chasis:</span>
              <span className={activeNode.tamperCircuitSecure ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                {activeNode.tamperCircuitSecure ? 'Sin Manipulación' : '¡Carcasa Abierta!'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Criptoprocesador Hardware:</span>
              <span className="text-slate-200">ATECC608B TEE</span>
            </div>
          </div>
        </div>

        {/* Sensor 4: Thermal & Power Status */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                <Thermometer className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xs text-slate-200">
                Térmico & Alimentación
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {activeNode.powerSource === 'AC_MAINS' ? 'RED AC 220V' : 'BATERÍA LIPO'}
            </span>
          </div>

          <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
            <div className="flex justify-between">
              <span>Temperatura ESP32-S3:</span>
              <span className="text-slate-100 font-bold">{activeNode.temperatureCelsius} °C</span>
            </div>
            <div className="flex justify-between">
              <span>Nivel de Batería:</span>
              <span className="text-emerald-400 font-bold">{activeNode.batteryPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span>Firmware TEE:</span>
              <span className="text-slate-400">{activeNode.firmwareVersion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
