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

import { Validadors } from '../shared/validadors/validadors';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  validador = new Validadors();
  perfilForm: FormGroup;

  obj_err = {
    teError: 0,
  };

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

  // Agafar de local
  perfil = {
    imatge: "",
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

    this.show("Cargando tus datos", 400);


    // Si hi ha foto en firebase, no fem res
    if (this.perfil.imatge) {
      console.log("dins");

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
      imatge: this.perfil.imatge,
    }

    // Es guarden les dades de l'usuari en la bdd
    this.fireService.updateUsuari(id, obj);
    this.cancelar();
  }

  // arreglar
  refrescarBotoAcceptar(error) {

    let algo = 'false';

    if (error != 0) {
      algo = 'true';
    }

    document.getElementById('boto_dels_collons').setAttribute("disabled", algo);
  }

  canvis_firestore_usuari() {
    let ruta = `/users/${this.service.getToken()}`;
    this.firestore.doc(ruta).valueChanges().subscribe((userData) => {
      this.perfil.nom = userData['nom'];
      this.perfil.cognoms = userData['cognoms'];
      this.perfil.edat = userData['edat'];
      this.perfil.imatge = userData['imatge'];
    });
  }

  // Imatge perfil
  addPhotoToGallery() {
    this.photoService.imatgeABase64()
      .then(
        (dada) => {
          this.perfil.imatge = dada;
        }
      )
      .catch();
  }

  // capa intermitja entre els validadors ( cal per al bloqueig del botó )
  nomMax() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.nomMax(this.perfil.nom, this.obj_err);
  }
  nomMin() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.nomMin(this.perfil.nom, this.obj_err);
  }
  nomInvalid() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.nomInvalid(this.perfil.nom, this.obj_err);
  }

  cognomInvalid() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.cognomInvalid(this.perfil.cognoms, this.obj_err);
  }
  cognomMin() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.cognomMin(this.perfil.cognoms, this.obj_err);
  }
  cognomMax() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.cognomMax(this.perfil.cognoms, this.obj_err);
  }

  edatMax() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.edatMax(this.perfil.edat, this.obj_err);
  }
  edatMinim() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.edatMinim(this.perfil.edat, this.obj_err);
  }
  edatTipus() {
    this.refrescarBotoAcceptar(this.obj_err.teError);
    return this.validador.edatTipus(this.perfil.edat, this.obj_err);
  }

}
