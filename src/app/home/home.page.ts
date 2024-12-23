import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController, AnimationController } from '@ionic/angular';
import { EstadoService } from 'src/app/services/estado.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  email: any;
  userEmail: string = ''; // Agregado para el template
  formulario: FormGroup;
  showCalendar: boolean = false;
  contador: number = 0;
  barcodes = [];
  NumFac: string;
  fechaActual: Date = new Date();
  notificacionesPendientes: number = 2;
  reunionesPendientes: any[] = [
    {
      titulo: 'Reunión de Planificación',
      hora: '10:00 AM',
      ubicacion: 'Sala A',
      tipo: 'normal'
    },
    {
      titulo: 'Presentación de Proyecto',
      hora: '14:30 PM',
      ubicacion: 'Sala Virtual',
      tipo: 'urgente'
    }
  ];

  constructor(
    public authService: AuthService,
    private storage: Storage,
    public ToastController: ToastController,
    private router: Router,
    private animationCtrl: AnimationController,
    private estadoService: EstadoService,
    public alertController: AlertController,
    public LoadingController: LoadingController,
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      tipoReunion: ['', Validators.required],
      fechaReunion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getProfile()
      .then(user => {
        this.email = user?.email;
        this.userEmail = user?.email || ''; // Actualizar también userEmail
        console.log(user?.email);
      })
      .catch(error => {
        console.error('Error getting user profile:', error);
      });

    this.estadoService.contadorActual.subscribe(valor => {
      this.contador = valor;
      console.log('ngOnInit: Contador Actualizado', this.contador);
    });

    this.cargarReunionesPendientes();
  }

  async cargarReunionesPendientes() {
    console.log('Reuniones cargadas:', this.reunionesPendientes.length);
  }

  // Método agregado para el error verCalendario
  verCalendario() {
    this.showCalendar = !this.showCalendar;
    console.log('Mostrar calendario:', this.showCalendar);
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/landing']);
    });
  }

  animarBoton() {
    const boton = document.querySelector('.boton-animado');
    if (boton) {
      const animacion = this.animationCtrl.create()
        .addElement(boton)
        .duration(500)
        .fromTo('transform', 'scale(1)', 'scale(1.2)')
        .fromTo('background-color', '#000000', '#ff5722');
      animacion.play();
    } else {
      console.error("No existe la clase .boton-animado");
    }
  }

  animarTarjeta() {
    const tarjeta = document.querySelector('.tarjeta-animada');
    if (tarjeta) {
      const animacion = this.animationCtrl.create()
        .addElement(tarjeta)
        .duration(1000)
        .fromTo('transform', 'translateX(-100%)', 'translate(0%)')
        .fromTo('opacity', '0', '1');
      animacion.play();
    } else {
      console.error("No existe la clase .tarjeta-animada");
    }
  }

  limpiar() {
    this.formulario.reset();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async mostrar() {
    if (this.formulario.invalid) {
      const alert = await this.alertController.create({
        header: 'Formulario Incompleto',
        message: 'Por favor, complete todos los campos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const formData = this.formulario.value;
    const alert = await this.alertController.create({
      header: 'Datos de la Reunión',
      message: `Nombre: ${formData.nombre}
Apellido: ${formData.apellido}
Tipo de Reunión: ${formData.tipoReunion}
Fecha de Reunión: ${formData.fechaReunion}`,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  navigateToagenda() {
    this.router.navigate(['/agenda']);
  }

  async registrarAsistencia(codigoReunion: string) {
    const loading = await this.LoadingController.create({
      message: 'Registrando asistencia...',
    });
    await loading.present();

    try {
      const toast = await this.ToastController.create({
        message: 'Asistencia registrada exitosamente',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.ToastController.create({
        message: 'Error al registrar la asistencia',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  async scanCode() {
    try {
      const result: { content: string } = await BarcodeScanner.startScan() as any;

      if (result && result.content) {
        const scannedData = result.content;
        await this.registrarAsistencia(scannedData);
        this.showToast(`Asistencia registrada para la reunión: ${scannedData}`);
      } else {
        this.showToast('No se detectó contenido en el código.');
      }
    } catch (error) {
      console.error("Error al escanear el código", error);
      this.showToast("Error al escanear el código");
    }
  }

  async showToast(message: string) {
    const toast = await this.ToastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}