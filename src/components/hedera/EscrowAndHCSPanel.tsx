import React, { useState } from 'react';
import { HCSMessage, EscrowSession, IoTShieldNode } from '../../types/protocol';
import { 
  Zap, ShieldCheck, CheckCircle2, Clock, ExternalLink, ArrowRight, 
  Plus, Key, Lock, Copy, Check, RefreshCw, Send, DollarSign 
} from 'lucide-react';
import { playTechChirp } from '../../utils/audioHaptic';

interface EscrowAndHCSPanelProps {
  messages: HCSMessage[];
  escrows: EscrowSession[];
  nodes: IoTShieldNode[];
  onReleaseEscrow: (sessionId: string) => void;
  onCreateEscrow: (title: string, beneficiary: string, amount: number) => void;
  onEmitManualHeartbeat: () => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const EscrowAndHCSPanel: React.FC<EscrowAndHCSPanelProps> = ({
  messages,
  escrows,
  nodes,
  onReleaseEscrow,
  onCreateEscrow,
  onEmitManualHeartbeat,
  onRequestBiometricAction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hcs' | 'escrow'>('escrow');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dealTitle, setDealTitle] = useState('Acuerdo Confidencial OTC - Mesa 02');
  const [beneficiary, setBeneficiary] = useState('0.0.884129');
  const [amountHbar, setAmountHbar] = useState(25000);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    playTechChirp('click');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestBiometricAction(
      `Firmar Depósito Escrow: ${amountHbar.toLocaleString()} HBAR`,
      () => {
        onCreateEscrow(dealTitle, beneficiary, amountHbar);
        setShowCreateModal(false);
        playTechChirp('biometric-success');
      }
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Network Header Banner */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
              Hedera Hashgraph Network
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Hedera Testnet
          </span>
        </div>

        <h2 className="text-base font-display font-bold text-slate-100">
          Infraestructura de Gobernanza & Escrow
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Consenso aBFT inmutable y ejecución condicionada a Proof-of-Physical-Shielding (PoPS)
        </p>

        {/* Sub-tab segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl mt-3.5 border border-slate-800/80">
          <button
            onClick={() => {
              playTechChirp('click');
              setActiveSubTab('escrow');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'escrow'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Smart Contracts Escrow ({escrows.length})
          </button>
          <button
            onClick={() => {
              playTechChirp('click');
              setActiveSubTab('hcs');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'hcs'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HCS Live Feed ({messages.length})
          </button>
        </div>
      </div>

      {/* Escrow View */}
      {activeSubTab === 'escrow' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-100">
                Acuerdos Condicionados a Blindaje
              </h3>
              <p className="text-xs text-slate-400">
                Solo se liberan si HCS valida el ambiente libre de espionaje
              </p>
            </div>
            <button
              onClick={() => {
                playTechChirp('click');
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Escrow</span>
            </button>
          </div>

          <div className="space-y-3">
            {escrows.map((escrow) => (
              <div
                key={escrow.sessionId}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-100">
                      {escrow.title}
                    </h4>
                    {/* Unboxed metadata line with typographic separator */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Para: {escrow.beneficiary}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-cyan-400 font-bold">{escrow.amountHbar.toLocaleString()} HBAR</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    escrow.executed
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : escrow.isShieldedVerified
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                  }`}>
                    {escrow.executed ? 'EJECUTADO' : escrow.isShieldedVerified ? 'POPS VERIFICADO' : 'AUDITANDO HCS'}
                  </span>
                </div>

                {/* Session Details */}
                <div className="my-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Session Hash:</span>
                    <button
                      onClick={() => handleCopy(escrow.sessionId)}
                      className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 text-[11px]"
                    >
                      <span>{escrow.sessionId.slice(0, 10)}...{escrow.sessionId.slice(-6)}</span>
                      {copiedHash === escrow.sessionId ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Iniciador (Multisig):</span>
                    <span className="text-slate-200">{escrow.initiator}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Prueba HCS Asociada:</span>
                    <span className="text-emerald-400">
                      {escrow.topicProofSequence ? `#${escrow.topicProofSequence} (Consenso OK)` : 'Recopilando telemetría...'}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                {!escrow.executed ? (
                  <button
                    disabled={!escrow.isShieldedVerified}
                    onClick={() => {
                      onRequestBiometricAction(
                        `Liberar Escrow de ${escrow.amountHbar.toLocaleString()} HBAR`,
                        () => onReleaseEscrow(escrow.sessionId)
                      );
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                      escrow.isShieldedVerified
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/50'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {escrow.isShieldedVerified
                        ? 'Liberar Fondos con Firma Biométrica (releaseEscrow)'
                        : 'Requiere Validación de Blindaje Físico en HCS'}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-mono text-slate-400 bg-slate-950/40 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Fondos transferidos con éxito en Hedera HSCS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HCS Live Stream View */}
      {activeSubTab === 'hcs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-100 flex items-center gap-1.5">
                <span>Hedera Consensus Service</span>
                <span className="text-xs text-cyan-400 font-mono font-normal">Topic 0.0.654321</span>
              </h3>
              <p className="text-xs text-slate-400">
                Heartbeats firmados por hardware ESP32 TEE ($0.0001 USD/msg)
              </p>
            </div>

            <button
              onClick={() => {
                playTechChirp('hcs-commit');
                onEmitManualHeartbeat();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Emitir Ping</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {messages.map((msg) => (
              <div
                key={msg.sequenceNumber}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">Seq #{msg.sequenceNumber}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-medium">{msg.deviceId}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    CONSENSO OK
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Timestamp:</span>
                  <span className="text-slate-200">{msg.consensusTimestamp}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Running Hash (SHA-384):</span>
                  <span className="text-slate-400 font-mono">{msg.runningHash}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Frecuencia Ultrasónica:</span>
                  <span className="text-cyan-300">{msg.frequency} kHz Activo</span>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Firma TEE: {msg.signature}</span>
                  <span className="text-emerald-400 font-semibold">Tarifa: ${msg.feeUSD} USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Escrow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="font-display font-bold text-base text-slate-100 mb-1">
              Crear Nuevo Escrow Hedera
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Fondos bloqueados en smart contract hasta confirmar blindaje físico en sala de reunión.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Título del Acuerdo / Reunión
                </label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Beneficiario (Hedera Account ID)
                </label>
                <input
                  type="text"
                  required
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Monto en HBAR
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amountHbar}
                  onChange={(e) => setAmountHbar(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Smart Contract:</span>
                  <span className="text-cyan-400">HederaShieldEscrow.sol</span>
                </div>
                <div className="flex justify-between">
                  <span>Condición de Pago:</span>
                  <span className="text-emerald-400">Proof-of-Shielding HCS</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 rounded-xl shadow-md"
                >
                  Confirmar con Biometría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
