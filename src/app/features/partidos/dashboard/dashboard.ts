import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatchmakingService, Partido } from '../../../core/services/matchmaking/matchmaking';
import { AuthService } from '../../../core/services/auth/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css' 
})
export class Dashboard implements OnInit {
  private matchmakingService = inject(MatchmakingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  partidos$!: Observable<Partido[]>;
  miPosicionActual: string = 'Portero';

  ngOnInit() {
    this.partidos$ = this.matchmakingService.getPartidosParaPosicion(this.miPosicionActual);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  irACrearPartido() {
    this.router.navigate(['/crear-partido']);
  }
}