import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  NavigationError,
  provideRouter,
  RedirectCommand,
  Router,
  withNavigationErrorHandler,
} from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { TasksEffects } from './features/tasks/tasks.effects';
import { tasksFeature } from './features/tasks/tasks.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideStore(),
    provideState({ name: tasksFeature.name, reducer: tasksFeature.reducer }),
    provideEffects([TasksEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
