import { Injectable } from '@angular/core';
import { AngularFireAuth, } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithPopup, } from "firebase/auth";
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
  
  
  constructor(public ngFireAuth: AngularFireAuth,
    public ToastController: ToastController,
  ) {

  }

  async registerUser(email: string, password: string, name: string) {
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)

  }

  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);

  }

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

  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  //este es pa los guards 

  isAuthenticated(): boolean {
    return !!this.ngFireAuth.currentUser; // Verifica si hay un usuario actual
  }

  //pal escaner que igual podria usar en general 
  async presentToast(message: string) {
    const toast = await this.ToastController.create({
      message,
      duration: 2000,
      position: 'top', // Puedes cambiar la posición
    });
    await toast.present();
  }
}
