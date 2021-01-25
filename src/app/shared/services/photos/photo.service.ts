import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource }
  from '@capacitor/core';
import { FirebaseService } from '../firebase/firebase.service';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  constructor(
    private service: FirebaseService,
  ) { }

  // Array amb les fotos
  public photos: Photo[] = [];
  public blob;
  public converted_image;
  public link;

  public async addNewToGallery() {
    // Es fa la foto
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    // Es genera un blob amb l'imatge
    this.photos.unshift({
      webviewPath: capturedPhoto.webPath
    });

    this.blob = new Blob([this.photos[0].webviewPath]);

    // Es guarda en firebase
    //this.service.setBlob(this.blob);
    this.service.guardarImatge(capturedPhoto);

    // Es passa el blob a un link
/*     
 */

    //this.blob = this.photos[0].webviewPath;

  }

  getLink() {

    this.service.getBlob();

  /*   return this.service.getBlob().then(el => {
      let reader = new FileReader();
      console.log("DINS: ", el)
      reader.onload = () => {
        alert(reader.result);
      }
 
      //reader.readAsText(el);

    })*/
  }
}


export interface Photo {
  webviewPath: string;
}
