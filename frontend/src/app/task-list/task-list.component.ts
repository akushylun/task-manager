import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskCardComponent } from './task-card/task-card.component';
import { Task, TaskStatus } from './task-card/task';
import { Store } from '@ngrx/store';
import { tasksActions } from '../features/tasks/tasks.actions';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  private readonly store = inject(Store);

  readonly title = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly status = input.required<TaskStatus>();

  readonly showInput = signal(false);

  toggleInput() {
    this.showInput.set(!this.showInput());
  }

  addCard(title = '') {
    this.store.dispatch(
      tasksActions.addTask({
        task: {
          id: 10,
          status: this.status(),
          title,
        },
      }),
    );
    this.toggleInput();
  }
}
