import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DraftTask, Task } from '../../task-list/task-card/task';
import { Update } from '@ngrx/entity';

export const tasksActions = createActionGroup({
  source: 'tasks',
  events: {
    'load tasks': emptyProps(),
    'tasks loaded success': props<{ tasks: Task[] }>(),
    'add task': props<{ task: DraftTask }>(),
    'task added success': props<{ task: Task }>(),
    'update task': props<{ task: Task }>(),
    'task updated success': props<{ update: Update<Task> }>(),
  },
});
