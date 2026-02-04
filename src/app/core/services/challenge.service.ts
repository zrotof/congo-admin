import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Challenge } from '../models/challenge.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/challenges`;

  // Signal qui contient la liste des challenges (notre "Source of Truth")
  challenges = signal<Challenge[]>([]);

  /**
   * Récupère tous les challenges depuis le Backend
   */
  getAllChallenges() {
    return this.http.get<ApiResponse<Challenge[]>>(this.API_URL, { 
      withCredentials: true 
    })
  }

  getChallengeById(id: number): Observable<ApiResponse<Challenge>> {
    return this.http.get<ApiResponse<Challenge>>(`${this.API_URL}/${id}`, { 
      withCredentials: true 
    });
  }


  /**
   * Crée un nouveau challenge (FormData car il y a une image)
   */
  createChallenge(formData: FormData) {
    return this.http.post<ApiResponse<Challenge>>(this.API_URL, formData, {withCredentials: true})
  }

  updateChallenge(id: number, formData: FormData): Observable<any> {
    // Note : On ne définit pas le Content-Type à 'multipart/form-data' manuellement.
    // Le navigateur le fera automatiquement avec le "boundary" correct parce qu'on passe un FormData.
    
    return this.http.put(`${this.API_URL}/${id}`, formData, {
      withCredentials: true
    });
  }

  /**
   * Supprime un challenge
   */
  deleteChallenge(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${id}`, { withCredentials: true });
  }
}