import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SnapFilter } from '../models/snap-filter.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SnapFilterService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/snapfilters`;

  filters = signal<SnapFilter[]>([]);

  /**
   * Récupère tous les filtres (admin)
   */
  getAllFilters(): Observable<ApiResponse<SnapFilter[]>> {
    return this.http.get<ApiResponse<SnapFilter[]>>(this.API_URL, {
      withCredentials: true
    });
  }

  /**
   * Récupère un filtre par ID
   */
  getFilterById(id: number): Observable<ApiResponse<SnapFilter>> {
    return this.http.get<ApiResponse<SnapFilter>>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }

  /**
   * Crée un nouveau filtre (FormData pour l'image)
   */
  createFilter(formData: FormData): Observable<ApiResponse<SnapFilter>> {
    return this.http.post<ApiResponse<SnapFilter>>(this.API_URL, formData, {
      withCredentials: true
    });
  }

  /**
   * Met à jour un filtre (FormData pour l'image)
   */
  updateFilter(id: number, formData: FormData): Observable<ApiResponse<SnapFilter>> {
    return this.http.put<ApiResponse<SnapFilter>>(`${this.API_URL}/${id}`, formData, {
      withCredentials: true
    });
  }

  /**
   * Supprime un filtre
   */
  deleteFilter(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }
}