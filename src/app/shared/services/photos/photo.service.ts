import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource }
  from '@capacitor/core';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  constructor(private base64ToGallery: Base64ToGallery) { }

  // Array amb les fotos
  public photos: Photo[] = [];

  public blob;

  public converted_image;

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100
    });

    // Save the picture and add it to photo collection
    //const savedImageFile = await this.savePicture(capturedPhoto);
    //this.photos.unshift(savedImageFile);

    this.photos.unshift({
      webviewPath: capturedPhoto.webPath
    });

    this.blob = new Blob([this.photos[0].webviewPath]);

    //console.log("Proves: ", this.blob.Data)
    //this.blob = this.photos[0].webviewPath;

  }

  public async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    //const base64Data = await this.readAsBase64(cameraPhoto);
    //console.log("Imatge capturadA: ", base64Data)

    // Write the file to the data directory
    //const fileName = '/assets/profile/' + new Date().getTime() + '.png';

  
    // Suposadament es guarda el fitxer (no va)
/*     await Filesystem.writeFile({
      data: base64Data,
      path: fileName,
      directory: FilesystemDirectory.Data

    }).then(el => {
      this.converted_image = "data:image/jpeg;base64," + base64Data;

    }).catch(e => {
      console.log("CATCH del photo service: ", e)
    }); */

    // Use webPath to display the new image instead of base64 since it's already loaded into memory
/*     return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    }; */
  }

/*   private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  } */

/*   private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  }); */

}


export interface Photo {
  webviewPath: string;
}
