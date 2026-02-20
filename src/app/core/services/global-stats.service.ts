import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GlobalStatsResponse {
  status: string;
  data: {
    totalVisits: number;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalStatsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/stats`;

  /**
   * Récupère les statistiques globales (nombre total de visites)
   * GET /api/stats
   */
  fetchStats(): Observable<GlobalStatsResponse> {
    return this.http.get<GlobalStatsResponse>(this.API_URL, {
      withCredentials: true
    });
  }
}