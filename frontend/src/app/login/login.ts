import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '../core/user/user.service';
import { AuthDataService } from '../core/auth/auth-data.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthDataService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.auth
      .signIn(email, password)
      .pipe(take(1))
      .subscribe((user) => {
        this.userService.set(user);
        this.router.navigate(['/tasks']);
      });
  }
}
