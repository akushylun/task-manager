import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tasks',
  },
  {
    path: 'tasks',
    component: TaskListComponent,
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account').then((c) => c.Account),
  },
];
