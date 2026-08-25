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

  /** Append a task the server already created, so it carries a real id. */
  addTask(task: Task) {
    this.tasks.update((tasks) => [...tasks, task]);
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
