import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const driverGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const stored = localStorage.getItem('currentUser');

  if (!stored) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(stored);

  if (user?.role?.toLowerCase() === 'driver') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};