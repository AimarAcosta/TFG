import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchmakingService, Partido } from '../../../core/services/matchmaking/matchmaking';
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
  
  partidos$!: Observable<Partido[]>;
  miPosicionActual = 'Portero';

  ngOnInit(): void {
    this.partidos$ = this.matchmakingService.getPartidosParaPosicion(this.miPosicionActual);
  }
}