import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

describe('AuthService', () => {
  let service: AuthService;
  let ngFireAuthMock: any;
  let toastControllerMock: any;

  beforeEach(() => {
    // Mock de AngularFireAuth
    ngFireAuthMock = {
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword'),
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword'),
      sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail'),
      signOut: jasmine.createSpy('signOut'),
      currentUser: null,
      onAuthStateChanged: jasmine.createSpy('onAuthStateChanged').and.callFake((callback: any) => callback(ngFireAuthMock.currentUser)),
      signInWithPopup: jasmine.createSpy('signInWithPopup'),
    };

    // Mock de ToastController
    toastControllerMock = {
      create: jasmine.createSpy('create').and.returnValue({
        present: jasmine.createSpy('present'),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: ngFireAuthMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('Debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debería registrar un usuario con email y contraseña', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';

    ngFireAuthMock.createUserWithEmailAndPassword.and.returnValue(Promise.resolve({ user: { email, uid: '123' } }));

    const result = await service.registerUser(email, password, name);

    expect(ngFireAuthMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(result.user.email).toBe(email);
  });

  it('Debería iniciar sesión con email y contraseña', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    ngFireAuthMock.signInWithEmailAndPassword.and.returnValue(Promise.resolve({ user: { email, uid: '123' } }));

    const result = await service.loginUser(email, password);

    expect(ngFireAuthMock.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(result.user.email).toBe(email);
  });

  it('Debería enviar un correo de restablecimiento de contraseña', async () => {
    const email = 'test@example.com';

    ngFireAuthMock.sendPasswordResetEmail.and.returnValue(Promise.resolve());

    await service.resetPassword(email);

    expect(ngFireAuthMock.sendPasswordResetEmail).toHaveBeenCalledWith(email);
  });

  it('Debería cerrar sesión', async () => {
    ngFireAuthMock.signOut.and.returnValue(Promise.resolve());

    await service.signOut();

    expect(ngFireAuthMock.signOut).toHaveBeenCalled();
  });

  it('Debería iniciar sesión con Google', async () => {
    const userMock = { email: 'googleuser@example.com', uid: 'google123' };

    ngFireAuthMock.signInWithPopup.and.returnValue(Promise.resolve({ user: userMock }));

    const result = await service.signInWithGoogle();

    expect(ngFireAuthMock.signInWithPopup).toHaveBeenCalledWith(jasmine.anything());
    expect(result.email).toBe(userMock.email);
  });

  it('Debería mostrar un toast con el mensaje especificado', async () => {
    const message = 'Mensaje de prueba';

    await service.presentToast(message);

    expect(toastControllerMock.create).toHaveBeenCalledWith({
      message,
      duration: 2000,
      position: 'top',
    });
    expect(toastControllerMock.create().present).toHaveBeenCalled();
  });
});
