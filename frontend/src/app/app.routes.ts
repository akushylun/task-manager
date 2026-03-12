import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tasks',
  },
  {
    path: 'tasks',
    component: TaskList,
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account').then((c) => c.Account),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((c) => c.Login),
  },
  {
    path: 'error',
    loadComponent: () => import('./not-found/not-found').then((c) => c.NotFound),
  },
  { path: '**', redirectTo: 'error' },
];
