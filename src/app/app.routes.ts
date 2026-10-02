import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page';
import { authGuard } from './auth/guards/auth.guard';
import { HomePage } from './pages/home/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    title: 'Login Page',
  },
  {
    path: 'Home',
    component: HomePage,
    title: 'Home Page',
    canActivate: [authGuard],
  },
];
