import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  getDocs,
  collectionData 
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

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
  // Inyectamos Firestore de la manera más robusta posible en Angular 21
  private readonly firestore: Firestore = inject(Firestore);

  constructor() {}

  getPartidosParaPosicion(posicion: string): Observable<Partido[]> {
    console.log('Investigando partidos en Firestore para:', posicion);
    
    try {
      const partidosRef = collection(this.firestore, 'partidos');
      const q = query(
        partidosRef, 
        where('estado', '==', 'abierto'),
        where('posiciones_necesitadas', 'array-contains', posicion)
      );
      
      // Usamos la versión de collectionData que mejor gestiona las instancias
      return collectionData(q, { idField: 'id' }) as Observable<Partido[]>;
    } catch (error) {
      console.error('Error de instancia en Matchmaking:', error);
      return from([]); // Retornamos vacío si hay choque de trenes
    }
  }
}