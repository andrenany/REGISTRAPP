import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated(); // Método que verifica la autenticación
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirige si no está autenticado
      return false; // Bloquea el acceso
    }
    return true; // Permite el acceso
  }
}
