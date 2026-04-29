import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
 
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
 
  // FIX: localStorage.setItem() always returns undefined (always false!).
  //      Use getItem() to READ the stored value instead.
  const isLoggedIn = localStorage.getItem('edutrack_user') !== null;
 
  if (isLoggedIn) {
    return true;
  }
 
  return router.createUrlTree(['/home'], {
    queryParams: { returnUrl: state.url }
  });
};
 