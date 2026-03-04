import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-actions',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './task-actions.component.html',
  styleUrl: './task-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskActionsComponent {
  readonly showInput = signal(false);
  readonly titleFormControl = new FormControl('', Validators.required);
  readonly add = output<string>();

  toggleInput() {
    const shouldShowInput = !this.showInput();
    this.showInput.set(shouldShowInput);

    if (!shouldShowInput) {
      this.titleFormControl.reset();
    }
  }

  addCard() {
    const value = this.titleFormControl.value;

    if (!this.titleFormControl.valid || !value) {
      return;
    }

    this.add.emit(value);
    this.toggleInput();
  }
}
