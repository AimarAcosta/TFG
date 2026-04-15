import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  loginSimulado(email: string): boolean {
    console.log(`Verificando credenciales para: ${email}`);
    if (email) {
      console.log('Acceso concedido');
      return true;
    }
    return false;
  }

  logoutSimulado(): void {
    console.log('Sesión cerrada');
  }
}