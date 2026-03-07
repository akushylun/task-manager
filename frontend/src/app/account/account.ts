import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account',
  imports: [],
  template: `<p>account works!</p>`,
  styleUrl: './account.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account { }
