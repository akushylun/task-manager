import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, MatProgressSpinnerModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly router = inject(Router);

  readonly isNavigating = computed(() => !!this.router.currentNavigation());
}
