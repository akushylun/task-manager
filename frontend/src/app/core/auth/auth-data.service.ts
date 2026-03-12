import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './auth';
import { API_URL } from '../api-url';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = inject(API_URL) + '/auth';

  me() {
    return this.httpClient.get<User>(`${this.baseUrl}/me`);
  }

  signIn(email: string, password: string) {
    return this.httpClient.post<User>(`${this.baseUrl}/signin`, { email, password });
  }

  signUp(email: string, password: string) {
    return this.httpClient.post<User>(`${this.baseUrl}/signup`, { email, password });
  }

  signOut() {
    return this.httpClient.post<boolean>(`${this.baseUrl}/signout`, {});
  }
}
