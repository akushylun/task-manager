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
import { TaskActionsComponent } from './task-actions-dialog/task-actions-dialog.component';
import { TaskStatus } from './task-card/task';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, MatButtonModule],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
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
      .open(TaskActionsComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((item) => item != null),
        tap((task) => this.store.dispatch(tasksActions.addTask({ task }))),
      )
      .subscribe();
  }
}
