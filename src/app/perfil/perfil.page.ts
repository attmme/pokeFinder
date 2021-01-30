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

import { PhotoService } from '../shared/services/photo/photo.service';

import { Validadors } from '../shared/validadors/validadors';
import { MissatgesErrors } from '../shared/missatgesErrors/missatgesErrors';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  validador = new Validadors();
  err = new MissatgesErrors();
  perfilForm: FormGroup;

  obj_err = { // es comparteix amb la classe validadors
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

  ngOnInit(): void {

    this.show("Cargando tus datos", 400);

    // Si no hi ha foto en firebase, posem una predeterminada
    // no és inmediat això. Pensa que primer posa l'avatar
    // i si ningú l'actualitza, es queda aquest.
    if (this.perfil.imatge == undefined || this.perfil.imatge == '') {
      this.perfil.imatge = "/assets/profile/avatar.png";
    }

    this.perfilForm = this.formBuilder.group({
      nom: this.validador.nom(),
      cognom: this.validador.cognom(),
      edat: this.validador.edat(),
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

  // disable / enable el botó d'acceptar en funció de si el formulari està bé
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

  guardarImatgePerfil() {
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
