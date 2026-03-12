import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DraftTask, Task } from './task';
import { API_URL } from '../api-url';

@Injectable({ providedIn: 'root' })
export class TasksDataService {
  private readonly baseUrl = inject(API_URL) + '/tasks';
  private readonly httpClient = inject(HttpClient);

  getTasks() {
    return this.httpClient.get<Task[]>(this.baseUrl);
  }

  addTask(task: DraftTask) {
    return this.httpClient.post<Task>(this.baseUrl, task);
  }

  update(id: Task['id'], task: Partial<DraftTask>) {
    return this.httpClient.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  delete(id: Task['id']) {
    return this.httpClient.delete<Task>(`${this.baseUrl}/${id}`);
  }
}
