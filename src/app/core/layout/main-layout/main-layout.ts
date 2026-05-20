import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { IdiomaService } from '../../services/idioma/idioma';

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
          <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
            🏟️ {{ idioma.idiomaActual() === 'ES' ? 'Mercado' : 'Merkatua' }}
          </a>
          <a routerLink="/app/crear-partido" routerLinkActive="active" class="nav-item">
            ➕ {{ idioma.idiomaActual() === 'ES' ? 'Organizar' : 'Antolatu' }}
          </a>
          <a routerLink="/app/perfil" routerLinkActive="active" class="nav-item">
            👤 {{ idioma.idiomaActual() === 'ES' ? 'Mi Perfil' : 'Nire Profila' }}
          </a>
        </nav>
        <button class="logout-sidebar" (click)="logout()">
          {{ idioma.idiomaActual() === 'ES' ? 'Cerrar Sesión' : 'Saioa Itxi' }}
        </button>
      </aside>

      <main class="main-content">
        <div style="display: flex; justify-content: flex-end; padding: 1rem 2rem 0;">
          <button class="btn" style="padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;" (click)="idioma.toggle()">
            🌐 {{ idioma.idiomaActual() }} / {{ idioma.idiomaActual() === 'ES' ? 'EU' : 'ES' }}
          </button>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  public idioma = inject(IdiomaService);

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}