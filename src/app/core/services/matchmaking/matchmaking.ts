import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  collectionData 
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

  getPartidosParaPosicion(posicion: string): Observable<Partido[]> {
    const partidosRef = collection(this.firestore, 'partidos');
    
    const q = query(
      partidosRef, 
      where('estado', '==', 'abierto'),
      where('posiciones_necesitadas', 'array-contains', posicion)
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<Partido[]>;
  }
}