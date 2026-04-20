import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  MatchmakingService,
  Partido,
} from "../../../core/services/matchmaking/matchmaking";
import { AuthService } from "../../../core/services/auth/auth";
import { Auth } from "@angular/fire/auth"; 
import { UsuarioService } from '../../../core/services/usuario/usuario';
import { Observable } from "rxjs";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"],
})
export class Dashboard implements OnInit {
  private matchmakingService = inject(MatchmakingService);
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  partidos$!: Observable<Partido[]>;
  miPosicionActual: string = "Portero";
  usuarioEmail: string = "";

  async ngOnInit() {
  this.usuarioEmail = this.auth.currentUser?.email || '';
  
  const perfil = await this.usuarioService.getPerfil();
  this.miPosicionActual = perfil?.posicion_preferida || 'Portero'; 
  
  this.partidos$ = this.matchmakingService.getPartidosParaPosicion(this.miPosicionActual);
}

  yaEstaInscrito(partido: Partido): boolean {
    if (!partido.jugadores_inscritos || !this.usuarioEmail) return false;
    return partido.jugadores_inscritos.includes(this.usuarioEmail);
  }

  async solicitarFichaje(partido: Partido) {
    if (!partido.id || !this.usuarioEmail) return;

    try {
      await this.matchmakingService.inscribirseEnPartido(
        partido.id,
        this.usuarioEmail,
      );
      console.log("¡Fichaje completado!");
    } catch (error) {
      console.error("Error al solicitar fichaje:", error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(["/login"]);
  }

  irACrearPartido() {
    this.router.navigate(["/crear-partido"]);
  }
}
