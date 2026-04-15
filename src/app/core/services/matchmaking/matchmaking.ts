import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Partido {
  id?: string;
  fecha: string;
  ubicacion: string;
  estado: string;
  posiciones_necesitadas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  getPartidosParaPosicion(posicion: string): Observable<Partido[]> {
    console.log(`Buscando partidos para la posición: ${posicion}`);
    
    const partidosRef = collection(this.firestore, 'partidos');
    const q = query(
      partidosRef, 
      where('estado', '==', 'abierto'),
      where('posiciones_necesitadas', 'array-contains', posicion)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Partido[]>;
  }
}