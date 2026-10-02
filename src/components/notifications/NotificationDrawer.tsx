import React, { useState } from 'react';
import { NotificationItem } from '../../types/protocol';
import { 
  Bell, AlertTriangle, ShieldCheck, Zap, Radio, Check, 
  Trash2, Volume2, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { playTechChirp } from '../../utils/audioHaptic';
import { requestBrowserNotificationPermission } from '../../services/mockHardwareHCS';

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectAction?: (notif: NotificationItem) => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onSelectAction,
  onRequestBiometricAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'shield' | 'hcs'>('all');
  const [pushEnabled, setPushEnabled] = useState(false);

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return n.type === 'critical';
    if (filter === 'shield') return n.type === 'shield';
    if (filter === 'hcs') return n.type === 'hcs';
    return true;
  });

  const handleEnablePush = async () => {
    const granted = await requestBrowserNotificationPermission();
    setPushEnabled(granted);
    playTechChirp('biometric-success');
  };

  const getIcon = (item: NotificationItem) => {
    switch (item.type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'shield':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'hcs':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Push Permissions Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-slate-100">
              Notificaciones Push en Tiempo Real
            </h3>
            <p className="text-[11px] text-slate-400">
              Alertas sonoras y hápticas ante intentos de espionaje o sabotaje
            </p>
          </div>
        </div>

        <button
          onClick={handleEnablePush}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm ${
            pushEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          }`}
        >
          {pushEnabled ? 'Activadas' : 'Habilitar'}
        </button>
      </div>

      {/* Filter Bar & Quick Actions */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'critical'
                ? 'bg-slate-800 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Críticas
          </button>
          <button
            onClick={() => setFilter('shield')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'shield'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Blindaje
          </button>
          <button
            onClick={() => setFilter('hcs')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              filter === 'hcs'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HCS
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onMarkAllRead}
            title="Marcar todas como leídas"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg text-xs"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onClearAll}
            title="Eliminar historial"
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg text-xs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="font-display font-bold text-sm text-slate-200">
              Sin Alertas Pendientes
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Todos los sensores IoT operan con parámetros seguros y óptimos.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.type === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20 shadow-md'
                  : !item.read
                  ? 'bg-slate-900 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${
                  item.type === 'critical'
                    ? 'bg-rose-950/50 border-rose-500/30'
                    : item.type === 'shield'
                    ? 'bg-cyan-950/50 border-cyan-500/30'
                    : 'bg-emerald-950/50 border-emerald-500/30'
                }`}>
                  {getIcon(item)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-xs text-slate-200">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Context tags */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    {item.deviceId && (
                      <span className="text-cyan-400/90">{item.deviceId}</span>
                    )}
                    {item.sensorType && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>Sensor: {item.sensorType}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
