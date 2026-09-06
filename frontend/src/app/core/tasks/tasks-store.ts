import { httpResource } from '@angular/common/http';
import { computed, inject, linkedSignal, Service } from '@angular/core';
import { API_URL } from '../api-url';
import { Task, TaskStatus } from './task';

/**
 * Client-side state for the task board.
 *
 * `tasksResource` owns the server state. `tasks` is a *writable* mirror of it, so the
 * board can apply optimistic updates without mutating derived state. Being a
 * `linkedSignal`, it resets to the server's answer every time the resource reloads.
 */
@Service()
export class TasksStore {
  private readonly baseUrl = inject(API_URL) + '/tasks';

  private readonly tasksResource = httpResource<Task[]>(() => this.baseUrl);

  readonly tasks = linkedSignal<Task[]>(() =>
    this.tasksResource.hasValue() ? this.tasksResource.value() : [],
  );

  readonly pendingTasks = computed(() => this.byStatus(TaskStatus.Pending));
  readonly inProgressTasks = computed(() => this.byStatus(TaskStatus.InProgress));
  readonly completedTasks = computed(() => this.byStatus(TaskStatus.Completed));

  /** Only the first load — `isLoading()` would also be true on every reload. */
  readonly isLoading = computed(() => this.tasksResource.status() === 'loading');
  readonly error = this.tasksResource.error;

  /**
   * Insert a task, or replace the one that already has its id.
   *
   * Idempotent on purpose. A socket is at-most-once and the tab that made a
   * change has already applied it optimistically, so its own event arrives as a
   * duplicate. The server cannot filter that out for us: the write arrives over
   * HTTP on a completely different connection from the socket, so the controller
   * has no idea which socket — if any — belongs to the caller.
   *
   * Absorbing the duplicate here is cheaper than teaching the client to announce
   * its socket id on every write, and it degrades better: two tabs of the same
   * account both converge whichever one acted.
   */
  upsertTask(task: Task) {
    this.tasks.update((tasks) => {
      const index = tasks.findIndex((existing) => existing.id === task.id);
      if (index === -1) {
        return [...tasks, task];
      }
      const next = [...tasks];
      next[index] = task;
      return next;
    });
  }

  moveTask(id: Task['id'], status: TaskStatus) {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }

  removeTask(id: Task['id']) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  /** Put back a snapshot taken before an optimistic update that then failed. */
  restore(snapshot: Task[]) {
    this.tasks.set(snapshot);
  }

  reload() {
    this.tasksResource.reload();
  }

  private byStatus(status: TaskStatus) {
    return this.tasks().filter((task) => task.status === status);
  }
}
