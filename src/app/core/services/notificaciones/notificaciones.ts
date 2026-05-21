import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from '@angular/fire/firestore';

export interface Notificacion {
  id?: string;
  receptor_email: string;
  mensaje: string;
  mensaje_eu: string;
  fecha: string;
  leida: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private firestore = inject(Firestore);

  async crearNotificacion(
    receptor: string,
    remitente: string,
    ubicacion: string,
  ) {
    const notif = {
      receptor_email: receptor,
      mensaje: `¡Fichaje de última hora! ${remitente} se ha unido a tu partido en ${ubicacion}.`,
      mensaje_eu: `Azken orduko fitxaketa! ${remitente} zure partidara batu da ${ubicacion}-(e)n.`,
      fecha: new Date().toISOString(),
      leida: false,
    };
    await addDoc(collection(this.firestore, 'notificaciones'), notif);
  }

  async getNotificaciones(email: string): Promise<Notificacion[]> {
    const q = query(
      collection(this.firestore, 'notificaciones'),
      where('receptor_email', '==', email),
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as Notificacion)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  async marcarComoLeida(id: string) {
    await updateDoc(doc(this.firestore, `notificaciones/${id}`), {
      leida: true,
    });
  }
}
