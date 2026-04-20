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

  async getPerfil(): Promise<PerfilUsuario | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const docRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as PerfilUsuario;
    }
    return null;
  }

  async guardarPerfil(perfil: PerfilUsuario): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    const docRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(docRef, perfil, { merge: true });
  }
}
