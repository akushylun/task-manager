import { TestBed } from '@angular/core/testing';
import { TasksDataService } from './tasks-data.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { Task, TaskStatus } from './task';

describe('TasksDataService', () => {
  let service: TasksDataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TasksDataService);
  });

  it('should get tasks', async () => {
    const tasks = firstValueFrom(service.getTasks());
    const req = httpTesting.expectOne('http://localhost:3000/tasks');
    const task = { id: 1, status: TaskStatus.Completed, title: 'title' };
    req.flush([task]);

    expect(await tasks).toEqual([task]);
    httpTesting.verify();
  });
});
