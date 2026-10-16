// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { importJWK, importSPKI, jwtVerify } from 'jose';
import { User } from '../../model/model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt'));
  private readonly pubKeySignal = signal<string | null>(localStorage.getItem('rsaPub'));
  private readonly currentUserSignal = signal<User | null>(null);

  public readonly currentUser = this.currentUserSignal.asReadonly();

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
    this.tokenSignal.set(null)
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
    const pubKey: any = this.getPubKey() ?? "";
    const alg = 'RS256';
    const parsedPubKey = await importJWK(pubKey, alg);
    return !(token && !(await jwtVerify(token, parsedPubKey)));

  }
}
