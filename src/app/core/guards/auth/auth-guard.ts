import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { take, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(currentUser => {
      if (currentUser) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
