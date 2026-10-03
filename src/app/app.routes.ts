import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page';
import { authGuard } from './auth/guards/auth.guard';
import { HomePage } from './pages/home/home-page/home-page';
import { LogOut } from './components/log-out/log-out/log-out';

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

  {
    path: 'LogOut',
    component: LogOut,
    title: 'logout Page',
    canActivate: [authGuard],
  },
];
