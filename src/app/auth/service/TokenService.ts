import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse } from '../../model/model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly http = inject(HttpClient);

  async login(username: string, password: string): Promise<APIResponse> {
    // Combine credentials and encode them to Base64 using btoa()
    const encodedCredentials = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${encodedCredentials}`
    });
    try {
      // Use firstValueFrom to convert the Observable to a Promise

      return await firstValueFrom(
        this.http.post<APIResponse>(
          'http://localhost:8080/auth',
          {},
          { headers: headers, responseType: 'text' as 'json' },
        ),
      );
    } catch (error: any) {
      console.error('Request failed:', error);
      // Throw the error or handle it based on your app's global error policy
      return(error as APIResponse);
    }




  }
}
