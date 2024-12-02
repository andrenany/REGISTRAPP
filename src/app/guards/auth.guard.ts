import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Método para verificar si el usuario está autenticado
  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();

    if (isAuthenticated) {
      return true;  // Si el usuario está autenticado, permite la navegación
    } else {
      this.router.navigate(['/login']);  // Si no está autenticado, redirige a la página de login
      return false;  // Bloquea la navegación
    }
  }
  
}
