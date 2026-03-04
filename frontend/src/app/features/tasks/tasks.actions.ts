import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../../task-list/task-card/task';

export const tasksActions = createActionGroup({
  source: 'tasks',
  events: {
    'load tasks': emptyProps(),
    'tasks loaded success': props<{ tasks: Task[] }>(),
    'add task': props<{ task: Pick<Task, 'status' | 'title'> }>(),
    'task added success': props<{ task: Task }>(),
  },
});
