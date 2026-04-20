import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchmakingService, Partido } from '../../../core/services/matchmaking/matchmaking';

@Component({
  selector: 'app-crear-partido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-partido.html',
  styleUrl: './crear-partido.css'
})
export class CrearPartido {
  private matchmakingService = inject(MatchmakingService);
  private router = inject(Router);

  ubicacion = '';
  fecha = '';
  hora = '';
  posicionesInput = 'Portero, Defensa'; 
  isLoading = false;

  async onSubmit() {
    if (!this.ubicacion || !this.fecha || !this.hora) return;
    this.isLoading = true;

    const posiciones = this.posicionesInput.split(',').map(p => p.trim());

    const nuevoPartido: Partido = {
      ubicacion: this.ubicacion,
      fecha: `${this.fecha} a las ${this.hora}`,
      estado: 'abierto',
      posiciones_necesitadas: posiciones
    };

    try {
      await this.matchmakingService.crearPartido(nuevoPartido);
      this.router.navigate(['/app/dashboard']); 
    } catch (error) {
      console.error('Error al crear el partido:', error);
    } finally {
      this.isLoading = false;
    }
  }

  cancelar() {
    this.router.navigate(['/app/dashboard']);
  }
}