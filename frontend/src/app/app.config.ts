import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  RedirectCommand,
  Router,
  withNavigationErrorHandler,
} from '@angular/router';

import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { routes } from './app.routes';
import { credentialsInterceptor } from './core/credentials/credentials-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const router = inject(Router);
        const errorPath = router.parseUrl('/error');
        return new RedirectCommand(errorPath);
      }),
    ),
    provideHttpClient(withXhr(), withInterceptors([credentialsInterceptor])),
  ],
};
