import { Injectable, signal } from '@angular/core';
import { importJWK, jwtVerify } from 'jose';
import { JwtClaims, User } from '../../common/model/model';


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

  public setCurrentUserFromJWT(token: string | null): void {
    const claims = this.parseJwtClaims(token);
    console.log("jwt parse check : "+JSON.stringify(claims))
    if (claims) {
      // Handle scenario where scope might be a space-separated string "read write admin"
      // or already parsed as an array of strings
      const extractedScopes = typeof claims['scope'] === 'string'
        ? claims['scope'].split(' ')
        : (claims['scope'] || []);

      this.setCurrentUser({
        userName: claims.sub,
        email: claims.sub,// The 'sub' attribute mapped to userId
        roles: extractedScopes    // The 'scope' attribute mapped to an array
      });
    }
  }

  private   parseJwtClaims(token: string | null): JwtClaims | null {
    if (!token) return null;

    try {
      // 1. Split the token and grab the payload (index 1)
      const base64Url = token.split('.')[1];

      // 2. Replace Base64URL characters back to standard Base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // 3. Decode the base64 string into a raw JSON string
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      // 4. Parse the string into a structured object
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid JWT Token structure', error);
      return null;
    }
  }

}
