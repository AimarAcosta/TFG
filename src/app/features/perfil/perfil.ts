import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario/usuario';
import { IdiomaService } from '../../core/services/idioma/idioma';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private usuarioService = inject(UsuarioService);
  public idioma = inject(IdiomaService);

  posicion: string = 'Portero';
  notaMedia: number = 5.0;
  votosTotales: number = 0;
  mensajeExito = false;

  async ngOnInit() {
    const perfil = await this.usuarioService.getPerfil();
    if (perfil?.posicion_preferida) {
      this.posicion = perfil.posicion_preferida;
    }

    const reputacion = await this.usuarioService.getReputacion();
    if (reputacion) {
      this.votosTotales = reputacion.num_valoraciones || 0;
      if (this.votosTotales > 0) {
        this.notaMedia = parseFloat(
          (reputacion.total_estrellas / this.votosTotales).toFixed(1),
        );
      }
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
