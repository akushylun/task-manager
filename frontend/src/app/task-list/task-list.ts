import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, switchMap } from 'rxjs';
import { TaskActionsDialog } from './task-actions-dialog/task-actions-dialog';

import { DraftTask, Task, TaskStatus } from '../core/tasks/task';
import { TasksDataService } from '../core/tasks/tasks-data.service';
import { TasksSocketService } from '../core/tasks/tasks-socket.service';
import { TasksStore } from '../core/tasks/tasks-store';
import { TaskCard } from './task-card/task-card';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, MatButtonModule, MatProgressSpinnerModule, CdkDrag, CdkDropList],
  templateUrl: './task-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly dialog = inject(MatDialog);
  private readonly tasksDataService = inject(TasksDataService);
  private readonly tasksStore = inject(TasksStore);

  /**
   * Injected for its side effect: creating it opens the socket and starts
   * applying server pushes to the store. Nothing here reads it, and nothing
   * should — the board renders from the store either way.
   */
  private readonly tasksSocket = inject(TasksSocketService);

  readonly status = TaskStatus;
  readonly pendingTasks = this.tasksStore.pendingTasks;
  readonly inProgressTasks = this.tasksStore.inProgressTasks;
  readonly completedTasks = this.tasksStore.completedTasks;
  readonly isLoading = this.tasksStore.isLoading;
  readonly error = this.tasksStore.error;

  /**
   * Open the task actions dialog and add the task the user confirmed.
   *
   * The POST response carries the server-generated id, so the new task can be pushed
   * straight into the store instead of triggering a full refetch.
   */
  open() {
    this.dialog
      .open<TaskActionsDialog, undefined, DraftTask>(TaskActionsDialog)
      .afterClosed()
      .pipe(
        filter((draft): draft is DraftTask => draft != null),
        switchMap((draft) => this.tasksDataService.addTask(draft)),
      )
      .subscribe({
        next: (created) => this.tasksStore.upsertTask(created),
        error: () => this.tasksStore.reload(),
      });
  }

  /**
   * Move a task to the column it was dropped on.
   *
   * The store is updated first so the card lands immediately, then rolled back to the
   * pre-drop snapshot if the server rejects the change.
   */
  drop(event: CdkDragDrop<Task[], Task[], Task>) {
    if (event.previousContainer === event.container) {
      return;
    }

    const task = event.item.data;
    const status = event.container.id as TaskStatus;
    const snapshot = this.tasksStore.tasks();

    this.tasksStore.moveTask(task.id, status);

    this.tasksDataService.update(task.id, { status }).subscribe({
      error: () => this.tasksStore.restore(snapshot),
    });
  }

  /**
   * Delete a task optimistically, restoring it if the request fails.
   * @param id
   */
  onDelete(id: Task['id']) {
    const snapshot = this.tasksStore.tasks();

    this.tasksStore.removeTask(id);

    this.tasksDataService.delete(id).subscribe({
      error: () => this.tasksStore.restore(snapshot),
    });
  }

  /** Re-run the initial fetch after a load failure. */
  retry() {
    this.tasksStore.reload();
  }
}
