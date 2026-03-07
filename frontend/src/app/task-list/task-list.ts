import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs';
import { tasksActions } from '../features/tasks/tasks.actions';
import {
  selectCompletedTasks,
  selectInProgressTasks,
  selectPendingTasks,
} from '../features/tasks/tasks.selectors';
import { TaskActionsDialog } from './task-actions-dialog/task-actions-dialog';
import { TaskStatus } from './task-card/task';
import { TaskCard } from './task-card/task-card';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, MatButtonModule],
  templateUrl: './task-list.html',
})
export class TaskList {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly status = TaskStatus;
  readonly pendingTasks = this.store.selectSignal(selectPendingTasks);
  readonly inProgressTasks = this.store.selectSignal(selectInProgressTasks);
  readonly completedTasks = this.store.selectSignal(selectCompletedTasks);

  ngOnInit(): void {
    this.store.dispatch(tasksActions.loadTasks());
  }

  open() {
    this.dialog
      .open(TaskActionsDialog)
      .afterClosed()
      .pipe(
        take(1),
        filter((item) => item != null),
        tap((task) => this.store.dispatch(tasksActions.addTask({ task }))),
      )
      .subscribe();
  }
}
