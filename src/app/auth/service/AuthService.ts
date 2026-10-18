// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { importJWK, importSPKI, jwtVerify } from 'jose';
import { User } from '../../common/model/model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt'));
  private readonly pubKeySignal = signal<string | null>(localStorage.getItem('rsaPub'));
  private readonly currentUserSignal = signal<User | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.tokenSignal.set(token);
  }

  // 2. Accept either a string or an object, and serialize it properly for localStorage
  setPubKey(key: string | Record<string, any>) {
    const stringKey = typeof key === 'object' ? JSON.stringify(key) : key;
    localStorage.setItem('rsaPub', stringKey);
    this.pubKeySignal.set(stringKey);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getPubKey(): string | null {
    return this.pubKeySignal();
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
    this.tokenSignal.set(null);
  }

  removePubKey(): void {
    localStorage.removeItem('rsaPub');
    this.pubKeySignal.set(null);
  }

  setCurrentUser(user: User){
    this.currentUserSignal.set(user);
  }

  removeCurrentUser():void{
    this.currentUserSignal.set(null);
  }

  async isAuthenticated(): Promise<boolean> {
    const token: string | null = this.getToken();
    const rawPubKey: string | null = this.getPubKey();

    if (!token || !rawPubKey || rawPubKey === '[object Object]') {
      return false;
    }

    try {

      const jwkObject = JSON.parse(rawPubKey);
      const alg = 'RS256';

      const parsedPubKey = await importJWK(jwkObject, alg);
      await jwtVerify(token, parsedPubKey);
      return true;
    } catch (err) {
      console.error('JWT Verification failed:', err);
      return false;
    }
  }
}
