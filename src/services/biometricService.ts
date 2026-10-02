import { BiometricAuthState } from '../types/protocol';
import { playTechChirp } from '../utils/audioHaptic';

const STORAGE_KEY_AUTH = 'hsp_biometric_state';

export class BiometricService {
  private static state: BiometricAuthState = {
    isAuthenticated: true, // Default to true after initial prompt or setup
    biometricMethod: 'fingerprint',
    isEnrolled: true,
    requireForCriticalActions: true,
    lastAuthTime: new Date(),
  };

  static getState(): BiometricAuthState {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AUTH);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...this.state,
            ...parsed,
            lastAuthTime: parsed.lastAuthTime ? new Date(parsed.lastAuthTime) : new Date(),
          };
        }
      } catch {
        // Fallback to default
      }
    }
    return this.state;
  }

  static saveState(partial: Partial<BiometricAuthState>) {
    this.state = { ...this.state, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.state));
      } catch {
        // Ignore storage errors
      }
    }
  }

  static async isHardwareBiometricAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      try {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Performs WebAuthn authentication if available, or returns false if fallback needed.
   */
  static async requestWebAuthnBiometric(actionName: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check if PublicKeyCredential is ready
    if (window.PublicKeyCredential) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Quick assertion request
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname,
          },
        });

        if (credential) {
          playTechChirp('biometric-success');
          this.saveState({ isAuthenticated: true, lastAuthTime: new Date() });
          return true;
        }
      } catch {
        // WebAuthn canceled or not configured on domain; trigger visual interactive biometric modal
        return false;
      }
    }
    return false;
  }

  static verifySimulatedBiometric(method: 'fingerprint' | 'faceid' | 'passkey'): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        playTechChirp('biometric-success');
        this.saveState({
          isAuthenticated: true,
          biometricMethod: method,
          lastAuthTime: new Date(),
        });
        resolve(true);
      }, 1200);
    });
  }

  static lock() {
    this.saveState({ isAuthenticated: false });
    playTechChirp('click');
  }
}
