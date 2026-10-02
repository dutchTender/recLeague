import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class TokenService {
  private readonly http = inject(HttpClient);

  login(username: string, password: string) {
    // Combine credentials and encode them to Base64 using btoa()
    const encodedCredentials = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`,
    });

    return this.http.post<string>('http://localhost:8080/auth', {}, { headers });
  }
}
