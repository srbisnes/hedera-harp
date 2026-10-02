import React, { useState, useRef, useEffect } from 'react';
import { SwarmAgent, SwarmChatMessage } from '../../types/auth';
import { SWARM_AGENTS } from '../../services/swarmService';
import { 
  Send, Sparkles, Bot, Shield, Zap, Lock, Cpu, Activity, 
  HelpCircle, ChevronRight, CornerDownLeft, RefreshCw, FileCode, Mic 
} from 'lucide-react';
import { playTechChirp } from '../../utils/audioHaptic';

interface SwarmChatPanelProps {
  messages: SwarmChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  onExecuteAction: (actionType: string) => void;
}

export const SwarmChatPanel: React.FC<SwarmChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onExecuteAction,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const query = inputText.trim();
    setInputText('');
    playTechChirp('click');
    onSendMessage(query);
  };

  const handleQuickQuestion = (q: string) => {
    if (isLoading) return;
    playTechChirp('click');
    onSendMessage(q);
  };

  return (
    <div className="space-y-4 pb-20 flex flex-col h-full">
      {/* Swarm Matrix Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
              Enjambre de Agentes HSP
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            4 Agentes en Línea
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Asistente colaborativo multi-agente: te asesoramos sobre por qué y para qué sirve HSP, cómo se usa y ejecutamos acciones contigo.
        </p>

        {/* 4 Agent badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          {SWARM_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2"
            >
              <span className="text-base select-none">{agent.avatarIcon}</span>
              <div className="min-w-0">
                <span className="text-[11px] font-display font-bold text-slate-200 block truncate">
                  {agent.name}
                </span>
                <span className="text-[9px] text-slate-400 font-mono block truncate">
                  {agent.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <button
          onClick={() => handleQuickQuestion('¿Por qué y para qué sirve Hedera Shield Protocol?')}
          className="whitespace-nowrap px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-cyan-300 transition-all font-medium flex items-center gap-1.5 shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>¿Por qué y para qué sirve?</span>
        </button>

        <button
          onClick={() => handleQuickQuestion('¿Cómo activo el blindaje y cómo se usa la app paso a paso?')}
          className="whitespace-nowrap px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-cyan-300 transition-all font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span>¿Cómo se usa paso a paso?</span>
        </button>

        <button
          onClick={() => handleQuickQuestion('¿Cómo funciona el Escrow y Hedera Consensus Service?')}
          className="whitespace-nowrap px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-cyan-300 transition-all font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Escrow & Hedera HCS</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3.5 flex-1 min-h-[350px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-[85%] bg-cyan-600/90 text-slate-950 font-medium text-xs py-2.5 px-4 rounded-2xl rounded-tr-sm shadow-md">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[10px] text-cyan-950/70 font-mono mt-1 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ) : (
              <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs">
                      🤖
                    </div>
                    <span className="text-xs font-display font-bold text-slate-200">
                      Deliberación del Enjambre HSP
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Text with Simple Markdown format */}
                <div className="text-xs text-slate-200 leading-relaxed space-y-2">
                  {msg.text.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="font-display font-bold text-sm text-cyan-300 mt-2">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    return (
                      <p key={idx} className="leading-relaxed whitespace-pre-line text-slate-300">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Agent Contributions Breakdown */}
                {msg.agentContributions && msg.agentContributions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/70 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                      Aportes Específicos de Agentes:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.agentContributions.map((contrib, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/70 text-[11px] flex items-start gap-2"
                        >
                          <span className="font-semibold text-cyan-400 shrink-0 font-display">
                            {contrib.agentName}:
                          </span>
                          <span className="text-slate-300 leading-snug">
                            {contrib.snippet}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Action Buttons */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          playTechChirp('click');
                          onExecuteAction(action.actionType);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-spin text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-cyan-400 font-display block">
                Enjambre deliberando...
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Coordinador, Centinela DePIN y Hashgraph Oracle correlacionando datos.
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-16 z-20 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"
      >
        <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-xl focus-within:border-cyan-500/50 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta al enjambre sobre funciones, qué es HSP o cómo usarlo..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-all shadow-md font-bold"
            aria-label="Enviar pregunta al enjambre"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
