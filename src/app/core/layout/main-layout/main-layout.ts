import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrl: './main-layout.css',
  template: `
    <div class="layout-container">
      <aside class="sidebar">
        <div class="brand-sidebar">⚽ MatchDay Hero</div>
        <nav class="nav-menu">
          <a
            routerLink="/app/dashboard"
            routerLinkActive="active"
            class="nav-item"
            >🏟️ Mercado</a
          >
          <a
            routerLink="/app/crear-partido"
            routerLinkActive="active"
            class="nav-item"
            >➕ Organizar</a
          >
          <a routerLink="/app/perfil" routerLinkActive="active" class="nav-item"
            >👤 Mi Perfil</a
          >
        </nav>
        <button class="btn-outline logout-sidebar" (click)="logout()">
          Cerrar Sesión
        </button>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
