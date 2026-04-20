import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div
        class="card-partido"
        style="max-width: 500px; margin: 0 auto; padding: 2rem;"
      >
        <h2>Gestión de Perfil</h2>
        <p class="posiciones-label" style="margin-bottom: 2rem;">
          Configura tu posición principal en el campo.
        </p>

        @if (mensajeExito) {
          <div
            style="color: var(--primary); margin-bottom: 1rem; font-weight: bold;"
          >
            ✅ Perfil actualizado
          </div>
        }

        <div class="form-group">
          <label>Posición Preferida</label>
          <select
            [(ngModel)]="posicion"
            class="input-field"
            style="margin-top: 0.5rem; background-color: var(--bg-main);"
          >
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Centrocampista">Centrocampista</option>
            <option value="Delantero">Delantero</option>
          </select>
        </div>

        <button
          class="btn full-width"
          style="margin-top: 1rem;"
          (click)="guardarCambios()"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  `,
})
export class Perfil implements OnInit {
  private usuarioService = inject(UsuarioService);

  posicion: string = 'Portero';
  mensajeExito = false;

  async ngOnInit() {
    const perfil = await this.usuarioService.getPerfil();
    if (perfil?.posicion_preferida) {
      this.posicion = perfil.posicion_preferida;
    }
  }

  async guardarCambios() {
    await this.usuarioService.guardarPerfil({
      posicion_preferida: this.posicion,
    });
    this.mensajeExito = true;
    setTimeout(() => (this.mensajeExito = false), 3000);
  }
}
