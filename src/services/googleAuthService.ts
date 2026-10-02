import { UserProfile } from '../types/auth';
import { playTechChirp } from '../utils/audioHaptic';

const STORAGE_KEY_USER = 'harp_demo_user';

export const DEFAULT_USER: UserProfile = {
  id: 'demo-user',
  email: '',
  name: 'Operador HARP',
  avatarUrl: '',
  provider: 'google',
  role: 'Security Operator (Demo)',
  hederaAccountId: '',
  isAuthenticated: false,
  tokenExpiresAt: 0,
};

export class GoogleAuthService {
  static getUser(): UserProfile {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_USER);
        if (saved) return JSON.parse(saved) as UserProfile;
      } catch {
        // Safe guest fallback.
      }
    }
    return DEFAULT_USER;
  }

  static saveUser(user: UserProfile) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } catch {
        // Storage may be unavailable.
      }
    }
  }

  // Demo-only local identity. This does not implement Google OAuth.
  static signInWithGoogle(customEmail?: string, customName?: string): UserProfile {
    const email = customEmail?.trim() || 'operator@example.invalid';
    const name = customName?.trim() ||
      email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

    const user: UserProfile = {
      id: `demo-${Date.now()}`,
      email,
      name,
      avatarUrl: '',
      provider: 'google',
      role: 'Security Operator (Demo)',
      hederaAccountId: '',
      isAuthenticated: true,
      tokenExpiresAt: Date.now() + 1000 * 60 * 60,
    };

    this.saveUser(user);
    playTechChirp('biometric-success');
    return user;
  }

  static signOut(): UserProfile {
    const guestUser: UserProfile = {
      ...DEFAULT_USER,
      id: '',
      name: 'Invitado',
    };
    this.saveUser(guestUser);
    playTechChirp('shield-off');
    return guestUser;
  }
}
