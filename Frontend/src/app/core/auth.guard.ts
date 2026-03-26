import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const user = localStorage.getItem('currentUser'); // 🔥 FIX KEY

  if (user) {
    return true;   // ✅ IMPORTANT
  }

  alert("Please login first");
  router.navigate(['/login']);
  return false;
};