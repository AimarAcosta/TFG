import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import {
  NotificacionService,
  Notificacion,
} from '../../core/services/notificaciones/notificaciones';
import { IdiomaService } from '../../core/services/idioma/idioma';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="container"
      style="max-width: 800px; margin: 0 auto; padding: 2rem;"
    >
      <div class="page-header" style="margin-bottom: 2rem;">
        <h2>
          🔔
          {{
            idioma.idiomaActual() === 'ES'
              ? 'Centro de Alertas'
              : 'Alerta Zentroa'
          }}
        </h2>
        <p style="color: var(--text-muted);">
          {{
            idioma.idiomaActual() === 'ES'
              ? 'Entérate al instante de los movimientos en tu plantilla.'
              : 'Jakin berehala zure taldeko mugimenduen berri.'
          }}
        </p>
      </div>

      @if (alertas.length === 0) {
        <div
          class="empty-state"
          style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border);"
        >
          <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
          <p>
            {{
              idioma.idiomaActual() === 'ES'
                ? 'El vestuario está tranquilo. No hay notificaciones nuevas.'
                : 'Aldagela lasai dago. Ez dago jakinarazpen berririk.'
            }}
          </p>
        </div>
      } @else {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          @for (notif of alertas; track notif.id) {
            <div
              [style.border-left]="
                notif.leida
                  ? '4px solid var(--border)'
                  : '4px solid var(--primary)'
              "
              style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; transition: all 0.3s ease;"
            >
              <div>
                <p
                  style="margin: 0; font-weight: 500; font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;"
                >
                  {{
                    idioma.idiomaActual() === 'ES'
                      ? notif.mensaje
                      : notif.mensaje_eu
                  }}
                </p>
                <small style="color: var(--text-muted);"
                  >🗓️ {{ notif.fecha | date: 'dd/MM/yyyy HH:mm' }}</small
                >
              </div>
              @if (!notif.leida) {
                <button
                  class="btn"
                  style="padding: 0.5rem 1rem; font-size: 0.85rem;"
                  (click)="marcarLeida(notif)"
                >
                  {{
                    idioma.idiomaActual() === 'ES'
                      ? 'Marcar leída'
                      : 'Irakurrita markatu'
                  }}
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Notificaciones implements OnInit {
  private auth = inject(Auth);
  private notificacionService = inject(NotificacionService);
  public idioma = inject(IdiomaService);

  alertas: Notificacion[] = [];

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user?.email) {
      this.alertas = await this.notificacionService.getNotificaciones(
        user.email,
      );
    }
  }

  async marcarLeida(notif: Notificacion) {
    if (notif.id) {
      await this.notificacionService.marcarComoLeida(notif.id);
      notif.leida = true;
    }
  }
}
