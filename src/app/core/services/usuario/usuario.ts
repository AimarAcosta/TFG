import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

export interface PerfilUsuario {
  posicion_preferida: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private async esperarUsuario(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async getPerfil(): Promise<PerfilUsuario | null> {
    const user = await this.esperarUsuario();
    if (!user) return null;

    const docRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PerfilUsuario;
    }
    return null;
  }

  async guardarPerfil(perfil: PerfilUsuario): Promise<void> {
    const user = await this.esperarUsuario();
    if (!user) throw new Error('No hay usuario autenticado');

    const docRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(docRef, perfil, { merge: true });
  }

  async valorarJugador(emailJugador: string, estrellas: number): Promise<void> {
    const docRef = doc(this.firestore, `reputacion/${emailJugador}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      await setDoc(
        docRef,
        {
          total_estrellas: (data['total_estrellas'] || 0) + estrellas,
          num_valoraciones: (data['num_valoraciones'] || 0) + 1,
        },
        { merge: true },
      );
    } else {
      await setDoc(docRef, {
        total_estrellas: estrellas,
        num_valoraciones: 1,
      });
    }
  }

  async getReputacion(): Promise<{
    total_estrellas: number;
    num_valoraciones: number;
  } | null> {
    const user = await this.esperarUsuario();
    if (!user || !user.email) return null;

    const docRef = doc(this.firestore, `reputacion/${user.email}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as {
        total_estrellas: number;
        num_valoraciones: number;
      };
    }
    return null;
  }
}
