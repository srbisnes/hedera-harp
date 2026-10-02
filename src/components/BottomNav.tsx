import React from 'react';
import { Cpu, Zap, Activity, Bell, Sparkles } from 'lucide-react';
import { playTechChirp } from '../utils/audioHaptic';

export type TabKey = 'nodes' | 'hedera' | 'sensors' | 'swarm' | 'notifications' | 'blueprint';

interface BottomNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  unreadCount: number;
  hasAlert: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadCount,
  hasAlert,
}) => {
  const tabs = [
    { key: 'nodes' as TabKey, label: 'Nodos', icon: Cpu },
    { key: 'hedera' as TabKey, label: 'Hedera', icon: Zap },
    { key: 'sensors' as TabKey, label: 'Sensores', icon: Activity },
    { key: 'swarm' as TabKey, label: 'Enjambre', icon: Sparkles },
    {
      key: 'notifications' as TabKey,
      label: 'Alertas',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      hasAlert: hasAlert,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                playTechChirp('click');
                onChangeTab(tab.key);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold font-mono flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
                {tab.hasAlert && !tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-medium">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
