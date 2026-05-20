import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  async onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Debes introducir tu correo y contraseña.';
      return;
    }
    if (!this.email.includes('@')) {
      this.errorMessage = 'Formato de correo inválido.';
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/app/dashboard']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Credenciales incorrectas. Fichaje denegado.';
    } finally {
      this.isLoading = false;
    }
  }
}
