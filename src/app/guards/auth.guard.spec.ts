import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user is authenticated', () => {
    // Simula un caso donde el usuario está autenticado
    spyOn(guard, 'isAuthenticated').and.returnValue(true); // Implementa `isAuthenticated` en tu guard
    expect(guard.canActivate()).toBeTrue();
  });

  it('should navigate to login if the user is not authenticated', () => {
    // Simula un caso donde el usuario no está autenticado
    spyOn(guard, 'isAuthenticated').and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
