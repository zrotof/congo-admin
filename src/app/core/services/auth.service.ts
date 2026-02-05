import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model'; // On réutilise ton interface
import { tap, catchError, of } from 'rxjs';

import { Router } from '@angular/router'
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  currentUser = signal<any | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  /**
   * Login du Staff
   */
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        if (res && res.data) {
          this.currentUser.set(res.data);
          console.log('Signal mis à jour avec :', res.data);
        }
      })
    );
  }

  checkAuthStatus() {
    return this.http.get<any>(`${this.API_URL}/me`, { withCredentials: true }).pipe(
      tap({
        next: (res) => {
          if (res.data) this.currentUser.set(res.data);
        },
        error: () => {
          this.currentUser.set(null);
        },
      }),
      catchError(() => of(null))
    );
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.set(null);
      })
    );
  }
}