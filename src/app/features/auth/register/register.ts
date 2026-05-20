import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Registro</h2>
        <form (ngSubmit)="onRegister()">
          <input type="email" [(ngModel)]="email" name="email" class="input-field" placeholder="Correo" required>
          <input type="password" [(ngModel)]="password" name="password" class="input-field" placeholder="Contraseña" required>
          <button type="submit" class="btn full-width">Crear cuenta</button>
        </form>
        <p style="text-align: center; margin-top: 1rem;"><a routerLink="/login">Volver al Login</a></p>
      </div>
    </div>
  `
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);
  email = '';
  password = '';

  async onRegister() {
    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      alert('Usuario creado correctamente');
      this.router.navigate(['/login']);
    } catch (e) {
      alert('Error al crear usuario');
    }
  }
}