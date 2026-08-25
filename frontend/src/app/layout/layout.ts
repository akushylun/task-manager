import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../core/user/user.service';

import { take } from 'rxjs';
import { AuthDataService } from '../core/auth/auth-data.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, MatProgressSpinnerModule, MatToolbarModule, MatButtonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authDataService = inject(AuthDataService);

  readonly isNavigating = computed(() => !!this.router.currentNavigation());
  readonly user = this.userService.user;

  logout() {
    this.authDataService
      .signOut()
      .pipe(take(1))
      .subscribe(() => {
        this.userService.clear();
        this.router.navigate(['/login']);
      });
  }
}
