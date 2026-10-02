import { UserProfile } from '../types/auth';
import { playTechChirp } from '../utils/audioHaptic';

const STORAGE_KEY_USER = 'hsp_google_user';

export const DEFAULT_USER: UserProfile = {
  id: 'google-oauth-1082947192847',
  email: 'rodrigoboero886@gmail.com',
  name: 'Rodrigo Boero',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'google',
  role: 'Administrador de Seguridad DePIN / Delegado de Gobernanza',
  hederaAccountId: '0.0.481923',
  isAuthenticated: true,
  tokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
};

export class GoogleAuthService {
  static getUser(): UserProfile {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_USER);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_USER;
  }

  static saveUser(user: UserProfile) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch {
        // ignore
      }
    }
  }

  static signInWithGoogle(customEmail?: string, customName?: string): UserProfile {
    const email = customEmail || 'rodrigoboero886@gmail.com';
    const name = customName || (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const user: UserProfile = {
      id: `google-oauth-${Date.now()}`,
      email,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      provider: 'google',
      role: 'Administrador de Seguridad DePIN / Delegado de Gobernanza',
      hederaAccountId: '0.0.481923',
      isAuthenticated: true,
      tokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };
    this.saveUser(user);
    playTechChirp('biometric-success');
    return user;
  }

  static signOut(): UserProfile {
    const guestUser: UserProfile = {
      id: '',
      email: '',
      name: 'Invitado No Autenticado',
      avatarUrl: '',
      provider: 'google',
      role: 'Acceso Restringido',
      hederaAccountId: '',
      isAuthenticated: false,
      tokenExpiresAt: 0,
    };
    this.saveUser(guestUser);
    playTechChirp('shield-off');
    return guestUser;
  }
}
