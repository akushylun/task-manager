import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { User } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly user$$ = new BehaviorSubject<User | null>(null);

  set(user: User | null) {
    this.user$$.next(user);
  }

  get() {
    return this.user$$.asObservable();
  }

  getValue() {
    return this.user$$.value;
  }
}
