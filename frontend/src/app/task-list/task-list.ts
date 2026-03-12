import { CdkDrag, CdkDragDrop, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs';
import { tasksActions } from '../features/tasks/tasks.actions';
import { tasksFeature } from '../features/tasks/tasks.reducer';
import { TaskActionsDialog } from './task-actions-dialog/task-actions-dialog';

import { TaskCard } from './task-card/task-card';
import { Task, TaskStatus } from '../core/tasks/task';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, MatButtonModule, CdkDrag, CdkDropList],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly status = TaskStatus;
  readonly pendingTasks = this.store.selectSignal(tasksFeature.selectPendingTasks);
  readonly inProgressTasks = this.store.selectSignal(tasksFeature.selectInProgressTasks);
  readonly completedTasks = this.store.selectSignal(tasksFeature.selectCompletedTasks);

  ngOnInit(): void {
    this.store.dispatch(tasksActions.loadTasks());
  }

  /**
   * Open task actions dialog and handle add task action
   */
  open() {
    this.dialog
      .open(TaskActionsDialog)
      .afterClosed()
      .pipe(
        take(1),
        filter((item) => item != null),
        tap((task) => this.store.dispatch(tasksActions.addTask(task))),
      )
      .subscribe();
  }

  /**
   * Drop event between task lists and update task status
   * @param event
   */
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const id = event.container.data[event.currentIndex].id;
    const status = event.container.id as TaskStatus;

    this.store.dispatch(tasksActions.updateTask({ id, task: { status } }));
  }

  /**
   * Delete task
   * @param id
   */
  onDelete(id: Task['id']) {
    this.store.dispatch(tasksActions.deleteTask({ id }));
  }
}
