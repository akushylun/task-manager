import { createSelector } from '@ngrx/store';
import { tasksFeature } from './tasks.reducer';
import { TaskStatus } from '../../task-list/task-card/task';

export const selectPendingTasks = createSelector(tasksFeature.selectTasks, (tasks) =>
  tasks.filter((t) => t.status === TaskStatus.Pending),
);

export const selectInProgressTasks = createSelector(tasksFeature.selectTasks, (tasks) =>
  tasks.filter((t) => t.status === TaskStatus.InProgress),
);

export const selectCompletedTasks = createSelector(tasksFeature.selectTasks, (tasks) =>
  tasks.filter((t) => t.status === TaskStatus.Completed),
);
