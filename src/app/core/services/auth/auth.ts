import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  // Observable del usuario actual (null si no está autenticado)
  readonly user$ = user(this.auth);

  // Observable booleano: true si hay sesión iniciada
  readonly isLoggedIn$ = this.user$.pipe(map(u => !!u));

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
