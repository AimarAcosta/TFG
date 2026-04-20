import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  styles: [
    `
      .layout-container {
        display: flex;
        min-height: 100vh;
        background-color: var(--bg-main);
      }
      .sidebar {
        width: 260px;
        background-color: var(--bg-card);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        padding: 2rem 1rem;
      }
      .brand-sidebar {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--text-main);
        margin-bottom: 3rem;
        text-align: center;
      }
      .nav-menu {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-grow: 1;
      }
      .nav-item {
        text-decoration: none;
        color: var(--text-muted);
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        transition: 0.2s;
        font-weight: 600;
      }
      .nav-item:hover,
      .nav-item.active {
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--primary);
      }
      .main-content {
        flex-grow: 1;
        overflow-y: auto;
      }
      .logout-sidebar {
        margin-top: auto;
        width: 100%;
      }
    `,
  ],
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
