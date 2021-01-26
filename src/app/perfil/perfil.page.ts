import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhotoService } from '../shared/services/photos/photo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfilForm: FormGroup;
  //usuari; // Usuari firebase

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    public service: AuthService,
    public firService: FirebaseService,
    private modalCtrl: ModalController,
    private photoService: PhotoService,
    private _DomSanitizer: DomSanitizer,
  ) { }

  // Agafar de local
  perfil = {
    imatge: "/assets/profile/avatar.png",
    nom: "",
    cognoms: "",
    edat: null
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
    // Es carrega l'imatge del server
    this.firService.usuariActual().then(usr => {

      let imatgeServer = usr['photoURL'];

      // Guardar nom i cognoms junt separats amb un _, fer split
      let nomComplet = usr['displayName'].split("_");

      this.perfil.nom = nomComplet[0];
      this.perfil.cognoms = nomComplet[1];
      this.perfil.edat = Number(nomComplet[2]);

      console.log("Contingut: ", this.perfil)

      // Es mira si la ruta segueix sent vàlida abans de passar-la al html
      try {
        let t = new Blob(imatgeServer);
        this.perfil.imatge = imatgeServer;
      } catch (e) {
        this.perfil.imatge = "/assets/profile/avatar.png";
      }

    })

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

  acceptar(formulari) {
    let nom = formulari.form.value.nom;
    let cognom = formulari.form.value.cognom;
    let edat = formulari.form.value.edat;

    // Es guarden les dades de l'usuari en la bdd
    this.firService.usuariActual().then(usr => {
      usr['updateProfile']({
        displayName: (nom + "_" + cognom + "_" + edat),
        photoURL: this.perfil.imatge
      })
    })

    this.cancelar();
  }

  // Canvia en el moment d'elegir, però no encara no es guarda
  canviarImatge() {
    this.photoService.addNewToGallery().then(img => {
      this.perfil.imatge = img;
    });
  }
}
