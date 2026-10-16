import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../auth/service/AuthService';
import { TokenService } from '../../auth/service/TokenService';
import { JwtClaims } from '../../model/model';



interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-comp',
  standalone: true,
  imports: [FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly tokenService: TokenService = inject(TokenService);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required.' });
    email(schemaPath.email, { message: 'Please enter a valid email address.' });
    required(schemaPath.password, { message: 'Password is required.' });
    minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters.' });
  });
  isLoading = signal(false);
  errorMessage = signal('');

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      this.errorMessage.set('Please fix form errors before submitting.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.removeToken();
    const credentials = this.loginModel();
    try{
      const response: any = await this.tokenService.getAccessToken(credentials.email, credentials.password);
      JSON.parse(response).status === 200
        ? await this.loginSuccess(JSON.parse(response).data)
        : await this.loginFailure(JSON.parse(response).message);
    }
    catch (error : any){
      await this.loginFailure(error);
    }
  }

  async loginSuccess(token: string) {
      this.authService.setToken(token);
      this.setCurrentUserFromJWT(token);
      const JWKs = await this.tokenService.getJWKs();
      this.authService.setPubKey(JWKs.data?.keys[0]);
      const navSuccess = await this.router.navigateByUrl('Home');
      console.log(navSuccess);

  }
  async loginFailure(error:string) {
    const navSuccess = await this.router.navigateByUrl('/');
    this.loginForm().reset({
      email:'',
      password: ''
    })
    this.errorMessage.set("User Authentication Failed: "+JSON.stringify(error));
    this.isLoading.set(false);
    console.log(navSuccess);
  }

  setCurrentUserFromJWT(token: string): void {
    const claims = this.parseJwtClaims(token);
    console.log("jwt parse check : "+JSON.stringify(claims))
    if (claims) {
      // Handle scenario where scope might be a space-separated string "read write admin"
      // or already parsed as an array of strings
      const extractedScopes = typeof claims['scope'] === 'string'
        ? claims['scope'].split(' ')
        : (claims['scope'] || []);

      this.authService.setCurrentUser({
        userName: claims.sub,
        email: claims.sub,// The 'sub' attribute mapped to userId
        roles: extractedScopes    // The 'scope' attribute mapped to an array
      });
    }
  }

  parseJwtClaims(token: string): JwtClaims | null {
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
