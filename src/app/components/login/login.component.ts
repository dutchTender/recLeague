import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../auth/service/AuthService';
import { TokenService } from '../../auth/service/TokenService';
import { map } from 'rxjs';

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

  // 1. Establish the source of truth as a Writable Signal model
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });
  // 2. Generate the form and define validation schemas in the callback
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
    // The entire form status is reactive
    if (this.loginForm().invalid()) {
      this.errorMessage.set('Please fix form errors before submitting.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    // Extract the raw, type-safe data by evaluating the model signal
    const credentials = this.loginModel();
    // call token endpoint
    console.log("cred check : "+JSON.stringify(credentials));
    const token = await this.tokenService.login(credentials.email, credentials.password);


    this.authService.setToken(token);
  }

  loginSuccess(token: string){
    this.authService.setToken(token);
    this.router.navigate(['/Home']).then(r => console.log("login success",r));

  }

  loginFailure(){

  this.router.navigate(['/Login']).then(r => console.error("login failed", r));
  }
}
