import { Injectable } from '@angular/core';
import { AngularFireAuth, } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, signInWithPopup, AuthErrorCodes, getAuth  } from 'firebase/auth';
import { User } from 'firebase/auth';
import { ToastController } from '@ionic/angular';
import { Observable} from 'rxjs';
import firebase from 'firebase/compat/app';


import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';



export interface Users{
  name:string;
  email: string
} 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  
  constructor(
    private ngFireAuth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  //registrar un usuario
  async registerUser(email: string, password: string, name: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)

  }
  
  //loggear un usuario
  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);

  }

  //resetear contraseña
  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);

  }
  
  async getProfile():Promise <User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.ngFireAuth.onAuthStateChanged(user => {
        if (user) {
          resolve(user as User);
        } else {
          resolve(null);
        }
      }, reject);
    })
  }
//cerrar sesion
  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  //este es pa los guards 
  isAuthenticated(): boolean {
    return !!this.ngFireAuth.currentUser; // Verifica si hay un usuario actual
  }


// Método para iniciar sesión con Google
async signInWithGoogle() {
  const provider = new GoogleAuthProvider();  // Usamos el proveedor de Google para autenticación
  try {
    const result = await this.ngFireAuth.signInWithPopup(provider);  // Usamos signInWithPopup de compatibilidad
    const user = result.user; // Aquí obtienes la información del usuario
    console.log('Usuario logueado con Google:', user);
    
    // Mostrar mensaje de éxito
    this.presentToast('Inicio de sesión exitoso');
    return user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    let errorMessage = 'Error desconocido';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Inicio de sesión cancelado';
    }
    this.presentToast(`Error al iniciar sesión con Google: ${errorMessage}`);
    return null;
  }
}

// Método para mostrar toast de éxito o error
async presentToast(message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 2000,
    position: 'top',
  });
  await toast.present();
}

}
