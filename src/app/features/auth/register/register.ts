import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { IdiomaService } from '../../../core/services/idioma/idioma';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrl: './register.css',
  template: `
    <div class="login-wrapper">
      <div style="position: absolute; top: 20px; right: 20px">
        <button
          class="btn"
          style="padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;"
          (click)="idioma.toggle()"
        >
          🌐 {{ idioma.idiomaActual() }} /
          {{ idioma.idiomaActual() === 'ES' ? 'EU' : 'ES' }}
        </button>
      </div>

      <div class="login-card">
        <div class="brand">
          <span class="icon">⚽</span>
          <h1>Matchday Hero</h1>
        </div>

        <h2
          style="text-align: center; margin-bottom: 1.5rem; color: var(--text-main);"
        >
          {{
            idioma.idiomaActual() === 'ES'
              ? 'Registro de Jugador'
              : 'Jokalari Berria'
          }}
        </h2>

        @if (errorMessage) {
          <div class="alert-error" style="margin-bottom: 1rem;">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onRegister()" novalidate>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            class="input-field"
            [placeholder]="
              idioma.idiomaActual() === 'ES'
                ? 'Correo electrónico'
                : 'Posta elektronikoa'
            "
            style="margin-bottom: 1rem;"
            required
          />

          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            class="input-field"
            [placeholder]="
              idioma.idiomaActual() === 'ES'
                ? 'Contraseña (mínimo 6 letras)'
                : 'Pasahitza (gutxienez 6 letra)'
            "
            style="margin-bottom: 1rem;"
            required
          />

          <button type="submit" class="btn full-width" [disabled]="isLoading">
            {{
              idioma.idiomaActual() === 'ES'
                ? isLoading
                  ? 'Fichando...'
                  : 'Crear mi ficha'
                : isLoading
                  ? 'Fitxatzen...'
                  : 'Fitxa sortu'
            }}
          </button>
        </form>

        <p style="text-align: center; margin-top: 1.5rem;">
          <a
            routerLink="/login"
            style="color: var(--text-muted); text-decoration: none; font-weight: 500;"
          >
            ⬅
            {{
              idioma.idiomaActual() === 'ES'
                ? 'Volver al banquillo (Login)'
                : 'Aulkira itzuli (Login)'
            }}
          </a>
        </p>
      </div>
    </div>
  `,
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  public idioma = inject(IdiomaService);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  async onRegister() {
    this.errorMessage = '';
    if (!this.email.trim() || !this.password.trim()) return;

    this.isLoading = true;
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password,
      );
      this.router.navigate(['/app/dashboard']);
    } catch (e: any) {
      console.error(e);
      this.errorMessage =
        this.idioma.idiomaActual() === 'ES'
          ? 'Error: El correo ya existe o la contraseña es muy corta.'
          : 'Errorea: Posta hori badago edo pasahitza laburregia da.';
    } finally {
      this.isLoading = false;
    }
  }
}
