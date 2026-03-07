import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DraftTask, Task } from '../task-list/task-card/task';

@Injectable({ providedIn: 'root' })
export class TasksDataService {
  private readonly httpClient = inject(HttpClient);

  getTasks() {
    return this.httpClient.get<Task[]>('http://localhost:3000/tasks');
  }

  addTask(task: DraftTask) {
    return this.httpClient.post<{ task: Task }>('http://localhost:3000/tasks', { task });
  }

  update(task: Task) {
    return this.httpClient.put<{ task: Task }>('http://localhost:3000/tasks', { task });
  }
}
