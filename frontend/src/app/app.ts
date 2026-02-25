import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { tasksActions } from './features/tasks/tasks.actions';
import {
  selectCompletedTasks,
  selectInProgressTasks,
  selectPendingTasks,
} from './features/tasks/tasks.selectors';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskStatus } from './task-list/task-card/task';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly store = inject(Store);

  readonly pendingTasks = this.store.selectSignal(selectPendingTasks);
  readonly inProgressTasks = this.store.selectSignal(selectInProgressTasks);
  readonly completedTasks = this.store.selectSignal(selectCompletedTasks);

  readonly taskStatus = TaskStatus;

  ngOnInit(): void {
    this.store.dispatch(tasksActions.loadTasks());
  }
}
