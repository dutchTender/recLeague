import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly http = inject(HttpClient);

  async login(username: string, password: string): Promise<any> {
    // Combine credentials and encode them to Base64 using btoa()
    const encodedCredentials = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`
    });

   this.http
     .post<string>(
       'http://localhost:8080/auth',
       {},
       {
         headers: headers,
         responseType: 'text' as 'json',
       },)
     .subscribe({
       next: (response) => {
         console.log('Server response:', JSON.stringify(response));
         return response;
       },
       error: (error) => {
         console.error('Request failed:', error);

         return error.message;
       },
     });

  }
}
