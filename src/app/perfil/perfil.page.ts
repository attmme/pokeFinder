import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService } from '../shared/services/photos/photo.service';
import { CameraPhoto, Filesystem, FilesystemDirectory } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';

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
    private photoService: PhotoService,
    private _DomSanitizer: DomSanitizer,
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

    let perfilsAnteriors = JSON.parse(localStorage.getItem("imatge"));

    if (perfilsAnteriors) {
      this.perfil.imatge = perfilsAnteriors;
    } else {
      console.log("No hi ha imatge: ", perfilsAnteriors)
    }

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
    this.modalCtrl.dismiss({ 'dismissed': true });
    //this.modalCtrl.dismiss(null , 'cancel');
  }

  aceptar() {
    // Es guarden les dades de l'usuari en la bdd

    // Es guarda l'imatge en el local storage
    localStorage.setItem("imatge", JSON.stringify(this.perfil.imatge));
    this.cancelar();
  }

  canviarImatge() {

    this.photoService.addNewToGallery().then(() => {
      this.perfil.imatge = this.photoService.photos[0].webviewPath;
      //this.perfil.imatge = this.photoService.converted_image;

      console.log("Blob inicial: ", this.perfil.imatge)
      console.log("Blob objecte: ", this.photoService.blob)

      /*       let reader = new FileReader();
      
            reader.onloadend = el => {
              console.log(reader.result)
              console.log(el)
            }
            reader.readAsDataURL(this.photoService.blob); */


      //this.perfil.imatge = window.URL.createObjectURL(this.photoService.blob);

    });

  }

}
