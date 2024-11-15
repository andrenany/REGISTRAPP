import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; 
import { Tarea } from '../tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async agregarTarea(tarea: Tarea): Promise<void> {
    const tareas = await this.obtenerTareas();
    tareas.push(tarea);
    await this._storage?.set('tareas', tareas);
  }

  async obtenerTareas(): Promise<Tarea[]> {
    const tareas = await this._storage?.get('tareas');
    return tareas || [];
  }

  async eliminarTarea(index: number) {
    const tareas = await this._storage?.get('tareas') || [];
    tareas.splice(index, 1);  // Eliminar tarea por su índice
    await this._storage?.set('tareas', tareas);  // Actualizar el almacenamiento
  }
  
  
}
