import React from 'react';
import { Shield, Lock, Unlock, Bell, Sparkles, Smartphone, Monitor, FileCode, User } from 'lucide-react';
import { UserProfile } from '../types/auth';
import { playTechChirp } from '../utils/audioHaptic';

interface HeaderBarProps {
  isBiometricLocked: boolean;
  onToggleLock: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSimulator: () => void;
  onOpenGoogleAuth: () => void;
  onOpenBlueprint: () => void;
  currentUser: UserProfile;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  activeShieldsCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isBiometricLocked,
  onToggleLock,
  unreadCount,
  onOpenNotifications,
  onOpenSimulator,
  onOpenGoogleAuth,
  onOpenBlueprint,
  currentUser,
  isPhoneFrame,
  onTogglePhoneFrame,
  activeShieldsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/60 border border-cyan-400/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            {activeShieldsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-wider text-slate-100">
                HSP SHIELD
              </span>
              <span className="text-[10px] font-mono text-cyan-400/90 tracking-tight">
                DePIN
              </span>
            </div>
            {/* Unboxed metadata line with typographic separator */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400">HCS 0.0.654321</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{activeShieldsCount} Activos</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Google Profile / Login Button */}
          <button
            onClick={() => {
              playTechChirp('click');
              onOpenGoogleAuth();
            }}
            title={currentUser.isAuthenticated ? `Google: ${currentUser.email}` : 'Iniciar Sesión con Google'}
            className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all"
            aria-label="Perfil de usuario Google"
          >
            {currentUser.isAuthenticated ? (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                {currentUser.name ? currentUser.name.charAt(0) : 'G'}
              </div>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="text-[11px] font-mono hidden md:inline text-slate-300 truncate max-w-[80px]">
              {currentUser.isAuthenticated ? (currentUser.name.split(' ')[0] || 'Google') : 'Google'}
            </span>
          </button>

          {/* Blueprint Code viewer button */}
          <button
            onClick={() => {
              playTechChirp('click');
              onOpenBlueprint();
            }}
            title="Ver Código Fuente & Blueprint"
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-xl transition-all"
            aria-label="Ver Blueprint"
          >
            <FileCode className="w-4 h-4" />
          </button>

          {/* Quick Simulation trigger */}
          <button
            onClick={() => {
              playTechChirp('click');
              onOpenSimulator();
            }}
            title="Simulador de Sensores & Ataques"
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-xl transition-all"
            aria-label="Simulador de sensores"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Biometric Lock Status */}
          <button
            onClick={() => {
              playTechChirp('click');
              onToggleLock();
            }}
            title={isBiometricLocked ? 'Desbloquear con Biometría' : 'Bloquear Sesión'}
            className={`p-1.5 rounded-xl transition-all ${
              isBiometricLocked
                ? 'text-amber-400 bg-amber-950/30 border border-amber-800/40'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
            aria-label="Estado biométrico"
          >
            {isBiometricLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              playTechChirp('click');
              onOpenNotifications();
            }}
            title="Notificaciones en tiempo real"
            className="relative p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl transition-all"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 min-w-[15px] h-3.5 px-0.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold font-mono flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Desktop/Phone Frame Switcher */}
          <button
            onClick={() => {
              playTechChirp('click');
              onTogglePhoneFrame();
            }}
            title={isPhoneFrame ? 'Expandir a Pantalla Completa' : 'Ver en Marco de Teléfono'}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition-all hidden sm:flex"
            aria-label="Cambiar vista de dispositivo"
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

