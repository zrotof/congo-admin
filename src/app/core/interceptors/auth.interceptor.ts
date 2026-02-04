import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  
  const authReq = req.clone({
    withCredentials: true
  });

return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // La session a expiré ou l'utilisateur n'est pas connecté
        messageService.add({ 
          severity: 'warn', 
          summary: 'Session expirée', 
          detail: 'Veuillez vous reconnecter.' 
        });
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // L'utilisateur n'a pas les droits (ex: Jovany essaie d'accéder à un truc d'Admin)
        messageService.add({ 
          severity: 'error', 
          summary: 'Accès refusé', 
          detail: 'Vous n\'avez pas les permissions nécessaires.' 
        });
      }
      
      return throwError(() => error);
    })
  );};