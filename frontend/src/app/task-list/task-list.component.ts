import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksActions } from '../features/tasks/tasks.actions';
import {
  selectCompletedTasks,
  selectInProgressTasks,
  selectPendingTasks,
} from '../features/tasks/tasks.selectors';
import { Task, TaskStatus } from './task-card/task';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskActionsComponent } from './task-actions/task-actions.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, TaskActionsComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  private readonly store = inject(Store);

  readonly status = TaskStatus;
  readonly pendingTasks = this.store.selectSignal(selectPendingTasks);
  readonly inProgressTasks = this.store.selectSignal(selectInProgressTasks);
  readonly completedTasks = this.store.selectSignal(selectCompletedTasks);

  ngOnInit(): void {
    this.store.dispatch(tasksActions.loadTasks());
  }

  onAddTask(title: string, status: TaskStatus) {
    const draftTask = { title, status };
    this.store.dispatch(tasksActions.addTask({ task: draftTask }));
  }
}
