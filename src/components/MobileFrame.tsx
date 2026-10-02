import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isPhoneFrame }) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <main className="max-w-2xl mx-auto w-full px-4 pt-3 flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-4 sm:py-8 px-2 flex items-center justify-center bg-grid-cyber">
      {/* Smartphone Chassis */}
      <div className="w-full max-w-[430px] h-[92vh] max-h-[890px] bg-slate-950 rounded-[48px] border-[6px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden relative">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-black rounded-full flex items-center justify-between px-2.5 pointer-events-none border border-slate-800/60 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-cyan-900/60" />
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 select-none bg-slate-950/80 backdrop-blur-sm z-30">
          <span>{currentTime || '09:41'}</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400">5G</span>
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-3 pt-1 scroll-smooth">
          {children}
        </div>

        {/* Home Bar Indicator */}
        <div className="py-1 flex justify-center bg-slate-950/90 pointer-events-none z-30">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
