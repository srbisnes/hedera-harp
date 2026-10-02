import React, { useState } from 'react';
import { UserProfile } from '../../types/auth';
import { X, ShieldCheck, LogOut, CheckCircle2, Key, Mail, User, ShieldAlert } from 'lucide-react';
import { GoogleAuthService } from '../../services/googleAuthService';
import { playTechChirp } from '../../utils/audioHaptic';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onRequestBiometricAction: (title: string, action: () => void) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onRequestBiometricAction,
}) => {
  const [emailInput, setEmailInput] = useState('rodrigoboero886@gmail.com');
  const [nameInput, setNameInput] = useState('Rodrigo Boero');
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    onRequestBiometricAction('Verificar Identidad para Inicio de Sesión Google', () => {
      const user = GoogleAuthService.signInWithGoogle(emailInput, nameInput);
      onUserChange(user);
      setIsEditing(false);
      playTechChirp('biometric-success');
    });
  };

  const handleSignOut = () => {
    const user = GoogleAuthService.signOut();
    onUserChange(user);
    playTechChirp('click');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/85 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Google G logo svg */}
            <div className="w-8 h-8 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
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
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Autenticación Google OAuth
              </h3>
              <p className="text-xs text-slate-400">
                Identidad verificada para gobierno y gestión de nodos HSP
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playTechChirp('click');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Cerrar modal de autenticación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-4">
          {currentUser.isAuthenticated ? (
            /* Signed-in profile view */
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3.5 relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-sm text-slate-100 truncate">
                      {currentUser.name}
                    </h4>
                    <span className="p-0.5 bg-emerald-500/20 text-emerald-400 rounded-full" title="Verificado con Google">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{currentUser.role}</p>
                </div>
              </div>

              {/* Security info cards */}
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Proveedor de Identidad:</span>
                  <span className="text-slate-200 font-semibold">Google OAuth 2.0 / OpenID</span>
                </div>
                <div className="flex justify-between">
                  <span>Billetera Hedera Vinculada:</span>
                  <span className="text-cyan-400 font-bold">{currentUser.hederaAccountId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sesión Criptográfica:</span>
                  <span className="text-emerald-400">Activa & Blindada</span>
                </div>
                <div className="flex justify-between">
                  <span>Permisos:</span>
                  <span className="text-slate-300">Control Jammer + Escrow Release</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  {isEditing ? 'Cancelar Cambio' : 'Cambiar Cuenta Google'}
                </button>
                <button
                  onClick={handleSignOut}
                  className="py-2 px-3 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/50 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

              {isEditing && (
                <div className="pt-3 border-t border-slate-800 space-y-2 animate-in fade-in">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Email de Cuenta Google</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Guardar y Conectar con Google
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Signed-out view */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-amber-300 block mb-0.5">
                    Modo Invitado / Sin Identidad
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Inicia sesión con tu cuenta de Google para sincronizar tus nodos ESP32 TEE con Hedera Hashgraph y autorizar transacciones de custodia.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Cuenta Google (Gmail / Workspace)
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nombre@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Tu Nombre"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all"
              >
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
                <span>Continuar con Google</span>
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Tokens protegidos en Enclave Local
          </span>
          <span>Google OpenID</span>
        </div>
      </div>
    </div>
  );
};
