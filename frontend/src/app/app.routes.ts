import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tasks',
  },
  {
    path: 'tasks',
    component: TaskList,
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account').then((c) => c.Account),
  },
];
