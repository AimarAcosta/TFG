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
  templateUrl: './main-layout.html' 
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  public idioma = inject(IdiomaService);
  
  currentUser = this.authService.getCurrentUser(); 

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}