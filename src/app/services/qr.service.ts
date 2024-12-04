import { Injectable } from '@angular/core';
import {BarcodeScanner} from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  scan: boolean=false
  scanResult: any=  ""
  constructor() { }
  
  async checkPermission(){
    try{ 
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
    
      if (status.granted) {
        // the user granted permission
        return true;
      }
    
      return false;
    }catch(e){
      return undefined;
    }
  }

  async StarScan(){
    if(!this.scan){
      this.scan = true;
      try{
        const Permission = await this.checkPermission();
        if(!Permission){
          alert("No hay permisos de camara. Activelos manualmente en la informacion de la aplicación")
          this.scan = false;
          this.scanResult ="error no hay permisos"
        }else{
          await BarcodeScanner.hideBackground();
          document.querySelector('body')?.classList.add('scanner-active');
          //this.content_visualiza hidden
          const result = await BarcodeScanner.startScan();
          console.log("resultado del escaneo: ", result) //vemos el resultado
          BarcodeScanner.showBackground();
          document.querySelector('boody')?.classList.remove('scanner-active');
          this.scan = false;
          if(result?.hasContent){
            this.scanResult = result.content;

          }
        }  
      }
      catch(e)
      {
          console.log(e);
      }
        
    } else {
        this.StopScan();
      }
  }
  async StopScan(){
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.scan = false;
    this.scanResult = ""

  }
}
 

