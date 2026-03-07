import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DraftTask, TaskStatus } from '../task-card/task';

@Component({
  selector: 'app-task-actions',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './task-actions-dialog.html',
  styleUrl: './task-actions-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskActionsDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef);

  readonly add = output<DraftTask>();
  readonly status = TaskStatus;
  readonly form = this.fb.group({
    title: this.fb.control('', Validators.required),
    status: this.fb.control('', Validators.required),
  });

  get types() {
    return Object.values(this.status);
  }

  addCard() {
    if (!this.form.valid) {
      this.dialogRef.close();
      return;
    }

    const draftTask = this.form.getRawValue() as DraftTask;
    this.dialogRef.close(draftTask);
  }
}
