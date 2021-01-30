import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
//import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { Photo, PhotoService } from '../shared/services/photo/photo.service';

import { Validadors } from './../validadors/validadors';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public service: AuthService,
    public fireService: FirebaseService,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    public loadingController: LoadingController,
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth, // Inject Firebase auth service,
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) {

    this.canvis_firestore_usuari();
  }

  validador = new Validadors();
  perfilForm: FormGroup;

  obj = {
    teError: 0
  }

  // Agafar de local
  perfil = {
    imatge: "",
    nom: "",
    cognoms: "",
    edat: null
  }

  blob_imatge; // aqui deixem la imatge a enviar/rebre de firebase

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

  // Text d'errors
  llistatErrors = {
    nomLlarg: "El campo introducido es demasiado largo",
    nomCurt: "El campo introducido es demasiado corto",
    nomWrong: "El campo nombre tiene carácteres incorrectos",

    cognomLlarg: "El campo introducido es demasiado largo",
    cognomCurt: "El campo introducido es demasiado corto",
    cognomWrong: "El campo apellido tiene carácteres incorrectos",

    edatMin: "La edad introducida es incorrecta",
    edatMax: "La edad introducida es demasiado grande",
    tipusNumber: "El valor introducido no es un número"
  }

  ngOnInit(): void {

    this.photoService.loadSaved();

    this.show("Cargando tus datos", 400);

    // Si hi ha localstorage, agafa imatge
    let fotoGuardada = JSON.parse(localStorage.getItem("_cap_photos"))

    // Si hi ha foto
    if (fotoGuardada) {
      if (fotoGuardada[0]) {
        setTimeout(() => {
          this.perfil.imatge = fotoGuardada[0].webviewPath;
        }, 200);
      }
    } else {
      this.perfil.imatge = "/assets/profile/avatar.png";
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

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  // spinner
  async show(text, temps) {
    const loading = await this.loadingController.create({
      message: text,
      duration: temps,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  // No guarda res i torna al home
  cancelar() {
    this.modalCtrl.getTop(); // en principi no cal
    this.modalCtrl.dismiss();
    // this.modalCtrl.dismiss({ 'dismissed': true });
  }

  acceptar(formulari) {
    let id = this.service.getToken();

    let obj = {
      nom: formulari.form.value.nom,
      cognoms: formulari.form.value.cognom,
      edat: formulari.form.value.edat,
    }

    // Es guarden les dades de l'usuari en la bdd
    this.fireService.updateUsuari(id, obj);
    this.cancelar();
  }

  victor_temporal(formulari) {
    console.log("enviat");

/*     let id = this.service.getToken();

    let obj = {
      nom: formulari.form.value.nom,
      cognoms: formulari.form.value.cognom,
      edat: formulari.form.value.edat,
      img: this.blob_imatge
    }

    this.fireService._test_victor(id, obj); */


    this.photoService.base64AImatge(this.blob_imatge)
    .then(
      (dada) => {
        console.log("dada rebuda : ", dada );
      }
    )
    .catch();
  }

  refrescarBotoAcceptar(error) {

    let algo = 'true';

    if (error == 0) {
      algo = 'false';
    }

    document.getElementById('boto_dels_collons').setAttribute("disabled", algo);
  }

  canvis_firestore_usuari() {
    let ruta = `/users/${this.service.getToken()}`;
    this.firestore.doc(ruta).valueChanges().subscribe((userData) => {
      this.perfil.nom = userData['nom'];
      this.perfil.cognoms = userData['cognoms'];
      this.perfil.edat = userData['edat'];
      // this.blob_imatge = userData['img'];
      this.perfil.imatge = userData['img'];
    });
  }

  // Imatge perfil
  addPhotoToGallery() {
    this.photoService.imatgeABase64()
      .then(
        (dada) => {
          // this.blob_imatge = dada;
          this.perfil.imatge = dada;
        }
      )
      .catch();
  }

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
        }
      }]
    });
    await actionSheet.present();
  }

}
