// auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem('jwt'));

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.tokenSignal.set(token);
  }
  getToken(): string | null {
    return this.tokenSignal();
  }
  removeToken(): void {
    localStorage.removeItem('jwt');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // add jose verify check.  we need to get the server jwk
    // meaning the server needs a jwk endpoint
    // Optional: check local expiration timestamp from payload
    return true;
  }
}
