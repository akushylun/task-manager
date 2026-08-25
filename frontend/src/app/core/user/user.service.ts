import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);

  set(user: User) {
    return this._user.set(user);
  }

  clear() {
    return this._user.set(null);
  }
}
