import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  MatchmakingService,
  Partido,
} from "../../../core/services/matchmaking/matchmaking";
import { AuthService } from "../../../core/services/auth/auth";
import { Auth, authState } from "@angular/fire/auth";
import { UsuarioService } from "../../../core/services/usuario/usuario";
import { Observable, from, of, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, filter, catchError, map } from "rxjs/operators";
import { IdiomaService } from "../../../core/services/idioma/idioma";
import { NotificacionService } from "../../../core/services/notificaciones/notificaciones"; // <-- Añade el import arriba

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
  public idioma = inject(IdiomaService);
  private notificacionService = inject(NotificacionService);

  partidos$!: Observable<Partido[]>;
  miPosicionActual: string = "Portero";
  usuarioEmail: string = "";

  mostrarModalValoracion = false;
  estrellasSeleccionadas = 0;
  partidoSeleccionadoParaValorar: Partido | null = null;

  ubicaciones = [
    "Polideportivo San Ignacio (Bilbao)",
    "Polideportivo Txurdinaga (Bilbao)",
    "Polideportivo Fadura (Getxo)",
    "Polideportivo Gorliz (Gorliz)",
    "Polideportivo Lasesarre (Barakaldo)",
    "San Mamés (Especial)",
  ];

  private filtroUbicacion$ = new BehaviorSubject<string>("");

  ngOnInit() {
    const partidosBase$ = authState(this.auth).pipe(
      filter((user) => user !== null),
      switchMap((user) => {
        this.usuarioEmail = user!.email || "";
        return from(this.usuarioService.getPerfil()).pipe(
          catchError(() => of(null)),
        );
      }),
      switchMap((perfil) => {
        this.miPosicionActual = perfil?.posicion_preferida || "Portero";
        return this.matchmakingService.getPartidosParaPosicion(
          this.miPosicionActual,
        );
      }),
    );

    this.partidos$ = combineLatest([partidosBase$, this.filtroUbicacion$]).pipe(
      map(([partidos, filtro]) => {
        if (!filtro) return partidos; 
        return partidos.filter((partido) => partido.ubicacion === filtro);
      }),
    );
  }

  onFiltroChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filtroUbicacion$.next(selectElement.value);
  }

  yaEstaInscrito(partido: Partido): boolean {
    if (!partido.jugadores_inscritos || !this.usuarioEmail) return false;
    return partido.jugadores_inscritos.includes(this.usuarioEmail);
  }

  async solicitarFichaje(partido: Partido) {
    if (!partido.id || !this.usuarioEmail) return;
    try {
      await this.matchmakingService.inscribirseEnPartido(partido.id, this.usuarioEmail);
      
      if (partido.creador_email && partido.creador_email !== this.usuarioEmail) {
         await this.notificacionService.crearNotificacion(partido.creador_email, this.usuarioEmail, partido.ubicacion);
      }
    } catch (error) {
      console.error("Error al solicitar fichaje:", error);
    }
  }

  abrirValoracion(partido: Partido) {
    this.partidoSeleccionadoParaValorar = partido;
    this.mostrarModalValoracion = true;
    this.estrellasSeleccionadas = 0;
  }

  cerrarValoracion() {
    this.mostrarModalValoracion = false;
    this.partidoSeleccionadoParaValorar = null;
  }

  async valorar(estrellas: number) {
    this.estrellasSeleccionadas = estrellas;
    try {
      if (this.partidoSeleccionadoParaValorar?.jugadores_inscritos) {
        for (const emailJugador of this.partidoSeleccionadoParaValorar
          .jugadores_inscritos) {
          if (emailJugador !== this.usuarioEmail) {
            await this.usuarioService.valorarJugador(emailJugador, estrellas);
          }
        }
      }
    } catch (error) {
      console.error("Error al guardar la valoración:", error);
    } finally {
      setTimeout(() => {
        this.cerrarValoracion();
      }, 600);
    }
  }
}
