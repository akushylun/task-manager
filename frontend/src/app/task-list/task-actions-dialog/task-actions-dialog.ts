import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { DraftTask, TaskStatus } from '../../core/tasks/task';

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
  styleUrl: './task-actions-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskActionsDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<TaskActionsDialog, DraftTask>>(MatDialogRef);

  readonly types = Object.values(TaskStatus);
  readonly form = this.fb.group({
    title: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    status: this.fb.control<TaskStatus | null>(null, { validators: Validators.required }),
  });

  addCard() {
    const { title, status } = this.form.getRawValue();

    // `status` starts out null, so the guard doubles as the narrowing TypeScript needs
    // to build a `DraftTask` without a cast.
    if (this.form.invalid || status === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({ title, status });
  }
}
