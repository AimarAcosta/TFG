import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';
import { IdiomaService } from '../../../core/services/idioma/idioma'; // Asegúrate de esta ruta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  public idioma = inject(IdiomaService); 

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit() {
    this.errorMessage = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Correo o contraseña incorrectos.';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}