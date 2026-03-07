import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Task } from './task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
})
export class TaskCard {
  task = input.required<Task>();
}
