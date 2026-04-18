import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// canActivate guard — protects /dashboard route (Check-in 2 & 4)
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if user has logged in
  const isLoggedIn = localStorage.getItem('edutrack_user') !== null;

  if (isLoggedIn) {
    return true;
  }

  // Redirect to /home with returnUrl
  return router.createUrlTree(['/home'], {
    queryParams: { returnUrl: state.url }
  });
};

// 🔑 To "log in" during demo, run in browser console:
// localStorage.setItem('edutrack_user', 'Leila')
// To log out:
// localStorage.removeItem('edutrack_user')