import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../../task-list/task-card/task';

export const tasksActions = createActionGroup({
  source: 'tasks',
  events: {
    'load tasks': emptyProps(),
    'tasks loaded success': props<{ tasks: Task[] }>(),
    'add task': props<{ task: Task }>(),
    'update task': props<{ task: Task }>(),
    'delete task': props<{ task: Task }>(),
  },
});
