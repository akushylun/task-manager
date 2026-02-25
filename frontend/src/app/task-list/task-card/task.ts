export interface Task {
  readonly id: number;
  readonly title: string;
  readonly status: TaskStatus;
}

export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
}
