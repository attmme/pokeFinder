import { Injectable } from '@angular/core';
import {
  Plugins, CameraResultType, /* Capacitor, FilesystemDirectory, */
  CameraPhoto, CameraSource
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  imatgeABase64(): Promise<string> {
    return new Promise((resolve, reject) => {

      Camera.getPhoto(
        {
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 100
        })
        .then(
          (dada) => {
            console.log("32, dada: ", dada);
            console.log("33, dada: " + dada);
            this.readAsBase64(dada)
              .then((resultat) => {
                console.log("36, dada: ", resultat);
                resolve(resultat);
              })
              .catch();
          }
        )
        .catch(
          (e) => { }
        )
    }
    )
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {

/*     if (this.platform.is('hybrid')) {

      const response = await fetch(cameraPhoto.path!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    } */

    // Mòbil
    // if (this.platform.is('hybrid')) {
    // const file = await Filesystem.readFile({
    // path: cameraPhoto.path
    // });
    // return file.data;
    // }

    // Web
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

}