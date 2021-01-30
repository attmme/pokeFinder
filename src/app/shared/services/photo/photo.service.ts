import { Injectable } from '@angular/core';
import {
  Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

let uri2path = require('file-uri-to-path');

const { Camera, Filesystem, Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";
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
            this.readAsBase64(dada)
              .then((resultat) => {

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

  base64AImatge(blob): Promise<any> {
    return new Promise((resolve, reject) => {

      let fileName = new Date().getTime() + '.jpeg';

      console.log("fileName: ", fileName);
      console.log("blob: ", blob);
      console.log("FilesystemDirectory.Data: ", FilesystemDirectory.Data);

      resolve(blob);
    });
  }






  private async readAsBase64(cameraPhoto: CameraPhoto) {

    // Mòbil (?)
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
      return file.data;
    }

    // Web (?)
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private async savePicture(cameraPhoto: CameraPhoto) {

    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    console.log("ch1.1: ", base64Data);


    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';

    console.log("ch1.2: ", fileName);


    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    console.log("ch1.3: ", savedFile);

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol

      let tmp = Capacitor.convertFileSrc(savedFile.uri);

      console.log("ch1.4: ", tmp);

      return {
        filepath: savedFile.uri,
        webviewPath: tmp,
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }


  // ----------------------------------------------------------------- old
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    console.log("ch1: ", capturedPhoto);

    const savedImageFile = await this.savePicture(capturedPhoto);

    console.log("ch2: ", savedImageFile);

    this.photos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

  }

  // Save picture to file on device

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePicture(photo: Photo, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // delete photo file from filesystem
    const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
  }

}

export interface Photo {
  filepath: string;
  webviewPath: string;
}