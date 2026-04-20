import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            this.errorMessage = 'Email o contraseña incorrectos.';
            break;
          case 'auth/too-many-requests':
            this.errorMessage = 'Demasiados intentos fallidos. Espera un momento.';
            break;
          default:
            this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
        console.error('Error de login:', err);
      }
    });
  }
}
