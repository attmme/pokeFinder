import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource }
  from '@capacitor/core';
//import { Storage } from '@ionic/storage';
//import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

//import { FirebaseService } from '../firebase/firebase.service';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  constructor(
  ) { }

  // Array amb les fotos
  public photos: Photo[] = [];

  async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    return capturedPhoto.webPath; //
  }
}

export interface Photo {
  webviewPath: string;
}
