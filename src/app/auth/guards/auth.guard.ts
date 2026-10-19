// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/AuthService';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isAuthenticated()) {
    authService.setCurrentUserFromJWT(authService.getToken());
    return true;
  }
  return router.navigate(['/']);
};
