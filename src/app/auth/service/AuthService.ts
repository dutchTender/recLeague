// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { importJWK, importSPKI, jwtVerify } from 'jose';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt'));
  private readonly pubKeySignal = signal<string | null>(localStorage.getItem('rsaPub'));
  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.tokenSignal.set(token);
  }
  setPubKey(key: string) {
    localStorage.setItem('rsaPub', key);
    this.pubKeySignal.set(key);
  }
  getToken(): string | null {
    return this.tokenSignal();
  }
  getPubKey(): string | null {
    return this.pubKeySignal();
  }
  removeToken(): void {
    localStorage.removeItem('jwt');
  }
  removePubKey(): void {
    localStorage.removeItem('rsaPub');
  }

  async isAuthenticated(): Promise<boolean> {
    const token: string | null = this.getToken();
    const pubKey: any = this.getPubKey() ?? "";
    const alg = 'RS256';
    const parsedPubKey = await importJWK(pubKey, alg);
    return !(token && !(await jwtVerify(token, parsedPubKey)));

  }
}
