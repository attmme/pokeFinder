import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfilForm: FormGroup;
  teError = 0;

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

  constructor(
    private formBuilder: FormBuilder,
    public service: AuthService,
    public fireService: FirebaseService,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    public loadingController: LoadingController,
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
  ) {

    this.canvis_firestore_usuari();
  }

  ngOnInit(): void {
    this.show("Cargando tus datos", 400);

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
    this.modalCtrl.dismiss({ 'dismissed': true });
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

  validador(params) {

    if (this.teError == 0) {
      document.getElementById('boto_dels_collons').setAttribute("disabled", "false");
    } else {
      document.getElementById('boto_dels_collons').setAttribute("disabled", "true");
    }

    let nom = this.perfil.nom;
    // let cognom = this.perfil.cognoms;
    let edat = Number(this.perfil.edat);

    let caractersValids = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let caractersCognomValids = caractersValids + " ";

    switch (params) {
      // Nom
      case "nomMax":
        if (nom.length > 20) {
          this.teError |= (1 << 0); // set bit 0
          return true
        }
        this.teError &= ~(1 << 0); // clear bit 0
        return false

      case "nomMin":
        if (nom.length >= 1 && nom.length < 3) {
          this.teError |= (1 << 1);
          return true
        }
        this.teError &= ~(1 << 1);
        return false

      case "nomInvalid":
        let j = 0;
        for (let i = 0; i < nom.length; i++) {
          if (caractersValids.includes(nom[i])) {
            j++;
          }
        }

        if ((j != nom.length)) {
          this.teError |= (1 << 2);
        }
        else {
          this.teError &= ~(1 << 2);
        }

        return (j != nom.length);

      // Cognom
      case "cognomMax":
        if (this.perfil.cognoms.length > 40) {
          this.teError |= (1 << 3);
          return true
        }
        this.teError &= ~(1 << 3);
        return false

      case "cognomMin":
        if (this.perfil.cognoms.length >= 1 && this.perfil.cognoms.length < 3) {
          this.teError |= (1 << 4);
          return true
        }
        this.teError &= ~(1 << 4);
        return false

      case "cognomInvalid":
        let k = 0;
        for (let i = 0; i < this.perfil.cognoms.length; i++) {
          if (caractersCognomValids.includes(this.perfil.cognoms[i])) {
            k++;
          }
        }

        if ((k != this.perfil.cognoms.length)) {
          this.teError |= (1 << 5);
        }
        else {
          this.teError &= ~(1 << 5);
        }

        return (k != this.perfil.cognoms.length);

      // Edat
      case "edatTipus":
        if (edat >= 0 || edat < 0) {
          this.teError &= ~(1 << 6);
          return false
        }
        this.teError |= (1 << 6);
        return true

      case "edatMax":
        if (edat > 110) {
          this.teError |= (1 << 7);
          return true
        }
        this.teError &= ~(1 << 7);
        return false

      case "edatMinim":
        if (edat < 0) {
          this.teError |= (1 << 8);
          return true
        }
        this.teError &= ~(1 << 8);
        return false
    }

  }

  canvis_firestore_usuari() {
    let ruta = `/users/${this.service.getToken()}`;
    this.firestore.doc(ruta).valueChanges().subscribe((userData) => {
      this.perfil.nom = userData['nom'];
      this.perfil.cognoms = userData['cognoms'];
      this.perfil.edat = userData['edat'];
    });
  }
}
