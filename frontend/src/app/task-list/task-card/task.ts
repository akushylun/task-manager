export interface Task {
  readonly id: number;
  readonly title: string;
  readonly status: TaskStatus;
}

export type DraftTask = Pick<Task, 'status' | 'title'>;

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
}
