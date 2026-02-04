import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ]
})

export class AppLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = signal(false);

  user = this.authService.currentUser;

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }
}
