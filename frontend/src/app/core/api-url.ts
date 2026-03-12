import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken('API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000',
});
