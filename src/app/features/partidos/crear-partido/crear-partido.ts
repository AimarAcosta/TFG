import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatchmakingService } from "../../../core/services/matchmaking/matchmaking";
import { Auth } from "@angular/fire/auth";
import { IdiomaService } from "../../../core/services/idioma/idioma";

@Component({
  selector: "app-crear-partido",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./crear-partido.html",
  styleUrl: "./crear-partido.css",
})
export class CrearPartido {
  private matchmakingService = inject(MatchmakingService);
  private router = inject(Router);
  private auth = inject(Auth);
  public idioma = inject(IdiomaService);

  ubicaciones = [
    "Polideportivo San Ignacio (Bilbao)",
    "Polideportivo Txurdinaga (Bilbao)",
    "Polideportivo Fadura (Getxo)",
    "Polideportivo Gorliz (Gorliz)",
    "Polideportivo Lasesarre (Barakaldo)",
    "San Mamés (Especial)",
  ];

  partido = {
    ubicacion: this.ubicaciones[0],
    fecha: "",
    hora: "",
    posiciones_necesitadas: [] as string[],
  };

  posicionesDisponibles = ["Portero", "Defensa", "Centrocampista", "Delantero"];
  isSubmitting = false;

  togglePosicion(pos: string) {
    const index = this.partido.posiciones_necesitadas.indexOf(pos);
    if (index > -1) {
      this.partido.posiciones_necesitadas.splice(index, 1);
    } else {
      this.partido.posiciones_necesitadas.push(pos);
    }
  }

  async onSubmit() {
    if (!this.auth.currentUser?.email) return;

    if (
      !this.partido.fecha ||
      !this.partido.hora ||
      this.partido.posiciones_necesitadas.length === 0
    ) {
      alert(
        this.idioma.idiomaActual() === "ES"
          ? "Completa todos los campos."
          : "Bete eremu guztiak.",
      );
      return;
    }

    this.isSubmitting = true;
    try {
      const fechaHora = `${this.partido.fecha} ${this.partido.hora}`;

      await this.matchmakingService.crearPartido({
        ubicacion: this.partido.ubicacion,
        fecha: fechaHora,
        posiciones_necesitadas: this.partido.posiciones_necesitadas,
        creador_email: this.auth.currentUser.email,
        jugadores_inscritos: [this.auth.currentUser.email],
      } as any);

      this.router.navigate(["/app/dashboard"]);
    } catch (error) {
      console.error("Error al crear partido:", error);
      alert(
        this.idioma.idiomaActual() === "ES"
          ? "Error al crear el partido"
          : "Errorea partida sortzean",
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
