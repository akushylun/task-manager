import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Layout } from './layout/layout';
@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
