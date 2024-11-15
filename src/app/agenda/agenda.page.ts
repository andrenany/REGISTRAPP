import { Component } from '@angular/core';
import { TareasService } from '../services/tarea.service';
import { Tarea } from '../tarea.model';
import { AlertController } from '@ionic/angular';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Router } from '@angular/router';

// Configura el idioma español
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage {
  dia: string = '';
  asignatura: string = '';
  descripcion: string = '';
  tareas: Tarea[] = [];

  constructor(private tareaService: TareasService, public alertController: AlertController,
    private router: Router,
  ) {}

  async ngOnInit() {
    try {
      this.tareas = await this.tareaService.obtenerTareas();
      console.log('Tareas cargadas:', this.tareas);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  }

  async agregarTarea() {
    if (!this.dia || !this.asignatura.trim() || !this.descripcion.trim()) {
      const alert = await this.alertController.create({
        header: 'Campos incompletos',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Crear nueva tarea con el día en formato dd/mm/aaaa
     
  // Crear nueva tarea
  const nuevaTarea: Tarea = {
    dia: new Date(this.dia.split('/').reverse().join('-')), // Convierte dd/mm/yyyy a un objeto Date
    asignatura: this.asignatura,
    descripcion: this.descripcion,
  };

    await this.tareaService.agregarTarea(nuevaTarea);
    console.log('Tarea agregada:', nuevaTarea);
    
    // Limpiar campos
    this.dia = '';
    this.asignatura = '';
    this.descripcion = '';

    // Actualizar lista de tareas
    await this.actualizarTareas();
  }

  async eliminarTarea(index: number) {
    await this.tareaService.eliminarTarea(index);
    console.log('Tarea eliminada en índice:', index);
    await this.actualizarTareas(); // Refrescar la lista
  }

  // Método para actualizar la lista de tareas
  async actualizarTareas() {
    try {
      this.tareas = await this.tareaService.obtenerTareas();
      console.log('Lista de tareas actualizada:', this.tareas);
    } catch (error) {
      console.error('Error al actualizar la lista de tareas:', error);
    }
  }

  // Método para formatear la fecha en formato dd/mm/aaaa
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`; // Devuelve la fecha en formato dd/mm/aaaa
  }



    // Navega a la página de inicio de sesión
    navigateTohome() {
      this.router.navigate(['/home']);
    }
  
}

