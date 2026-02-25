import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../task-list/task-card/task';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksDataService {
  private readonly httpClient = inject(HttpClient);

  getTasks() {
    return this.httpClient.get<Task[]>('http://localhost:3000/tasks');
  }
}
