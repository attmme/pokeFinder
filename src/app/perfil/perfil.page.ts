import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService } from '../shared/services/photos/photo.service';
import { CameraPhoto, Filesystem, FilesystemDirectory } from '@capacitor/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfilForm: FormGroup;

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    public service: AuthService,
    private modalCtrl: ModalController,
    private photoService: PhotoService
  ) { }

  // Agafar de local
  perfil = {
    imatge: "/assets/profile/avatar.png",
    nom: "NOM",
    cognoms: "COGNOM",
    edat: 99,
  }

  // Text que apareix i no són errors
  llistatApartats = {
    titol: "Perfil",
    boto1: "Cancelar",
    boto2: "Aceptar",
    nom: "NOM",
    cognom: "COGNOM",
    edat: 999
  }

  // Simulador del mat-error
  elmClicats = {
    nom: false,
    cognom: false,
    edat: false
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern("^[a-z0-9._%+-]$")
      ]],
      cognom: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern("^[a-z0-9._%+-]$")
      ]],
      edat: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.max(110),
        Validators.pattern("^[0-9]$")
      ]],
    });
  }

  // No guarda res i torna al home
  cancelar() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  aceptar() {
    // Guardar dades en json
    // Carregar-se foto anterior i posar la nova
    // Guardar-ho tot en la bdd
    this.cancelar();
  }

  canviarImatge() {

    this.photoService.addNewToGallery().then(() => {
      this.perfil.imatge = this.photoService.photos[0].webviewPath;

      console.log("Foto guardada: ",  this.photoService.photos)
    })
/*    
      console.log("Imatge:", this.perfil.imatge)
       */

  }


  public async guardarImatge(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.png';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };

  }

  public async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
