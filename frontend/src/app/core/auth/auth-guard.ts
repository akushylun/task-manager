import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { catchError, map, of, take } from 'rxjs';
import { UserService } from '../user/user.service';
import { AuthDataService } from './auth-data.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  const user = userService.getValue();

  if (user) {
    return of(true);
  }

  return authDataService.me().pipe(
    take(1),
    map((user) => {
      userService.set(user);
      return true;
    }),
    catchError(() => {
      const loginPath = router.parseUrl('/login');
      return of(new RedirectCommand(loginPath));
    }),
  );
};
