import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  idiomaActual = signal<'ES' | 'EU'>('ES');

  toggle() {
    this.idiomaActual.update((lang) => (lang === 'ES' ? 'EU' : 'ES'));
  }
}
