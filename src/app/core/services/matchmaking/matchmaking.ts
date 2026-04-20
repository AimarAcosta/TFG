import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  collectionData,
  addDoc // <-- 1. Añadimos esta importación
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Partido {
  id?: string;
  ubicacion: string;
  fecha: string;
  estado: string;
  posiciones_necesitadas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly injector: Injector = inject(Injector);

  getPartidosParaPosicion(posicion: string): Observable<Partido[]> {
    return runInInjectionContext(this.injector, () => {
      const partidosRef = collection(this.firestore, 'partidos');
      const q = query(
        partidosRef, 
        where('estado', '==', 'abierto'),
        where('posiciones_necesitadas', 'array-contains', posicion)
      );
      return collectionData(q, { idField: 'id' }) as Observable<Partido[]>;
    });
  }

  async crearPartido(nuevoPartido: Partido): Promise<any> {
    const partidosRef = collection(this.firestore, 'partidos');
    return await addDoc(partidosRef, nuevoPartido);
  }
}