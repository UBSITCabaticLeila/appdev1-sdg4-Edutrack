import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = true; // replace with real logic
  return isLoggedIn ? true : router.createUrlTree(['/home']);
};
