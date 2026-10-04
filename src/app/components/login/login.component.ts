import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../auth/service/AuthService';
import { TokenService } from '../../auth/service/TokenService';
import { NgForm } from '@angular/forms';


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
        : await this.loginFailure();
    }
    catch (error : any){
      await this.loginFailure();
    }

  }

  async loginSuccess(token: string) {
      this.authService.setToken(token);
      // get public key - always get rsa pub key on user login. we will verify jwt client side
      const JWKs = await this.tokenService.getJWKs();
      this.authService.setPubKey(JWKs.data?.keys[0]);
      const navSuccess = await this.router.navigateByUrl('Home');
      console.log(navSuccess);

  }
  async loginFailure() {
    const navSuccess = await this.router.navigateByUrl('/');
    this.loginForm().reset({
      email:'',
      password: ''
    })
    this.errorMessage.set("User Authentication Failed....");
    this.isLoading.set(false);
    console.log(navSuccess);
  }
}
