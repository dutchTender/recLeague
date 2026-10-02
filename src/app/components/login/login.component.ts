import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
// Import from the dedicated signals submodule
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-comp',
  standalone: true,
  // FormField directive binds your fields to HTML elements natively
  imports: [FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly router = inject(Router);

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

  onSubmit(event: Event) {
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

    setTimeout(() => {
      this.isLoading.set(false);

      if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Invalid email or password.');
      }
    }, 1500);
  }
}
