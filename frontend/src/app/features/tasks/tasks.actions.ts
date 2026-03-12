import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Update } from '@ngrx/entity';
import { DraftTask, Task } from '../../core/tasks/task';

export const tasksActions = createActionGroup({
  source: 'tasks',
  events: {
    'load tasks': emptyProps(),
    'tasks loaded success': props<{ tasks: Task[] }>(),
    'add task': props<DraftTask>(),
    'task added success': props<Task>(),
    'update task': props<{ id: Task['id']; task: Partial<DraftTask> }>(),
    'task updated success': props<{ update: Update<Task> }>(),
    'delete task': props<{ id: Task['id'] }>(),
    'task deleted success': props<{ id: Task['id'] }>(),
  },
});
