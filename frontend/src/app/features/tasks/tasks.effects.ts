import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { TasksDataService } from '../../core/tasks-data.service';
import { tasksActions } from './tasks.actions';

@Injectable({ providedIn: 'root' })
export class TasksEffects {
  private readonly tasksDataService = inject(TasksDataService);
  private readonly actions$ = inject(Actions);

  readonly loadTasks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(tasksActions.loadTasks),
        switchMap(() => this.tasksDataService.getTasks()),
        map((tasks) => tasksActions.tasksLoadedSuccess({ tasks })),
      ),
    { functional: true },
  );

  readonly addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tasksActions.addTask),
      switchMap(({ task }) => this.tasksDataService.addTask(task)),
      map(({ task }) => tasksActions.taskAddedSuccess({ task })),
    ),
  );

  readonly updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tasksActions.updateTask),
      switchMap(({ task }) => this.tasksDataService.update(task)),
      map(({ task }) =>
        tasksActions.taskUpdatedSuccess({ update: { id: task.id, changes: task } }),
      ),
    ),
  );
}
