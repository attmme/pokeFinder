import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  perfilForm: FormGroup;
  teError = 0;

  constructor(
    private formBuilder: FormBuilder,
    public service: AuthService,
    public firService: FirebaseService,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    public loadingController: LoadingController
  ) { }

  // spinner
  async show(text, temps) {
    const loading = await this.loadingController.create({
      message: text, 
      duration: temps,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }


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

  ngAfterViewInit() {

    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    // Captura d'errors
    this.perfilForm = this.formBuilder.group({
      cognom: ['', [
        Validators.maxLength(40),
        Validators.minLength(3),
      ]]
    });

    this.show("Cargando tus datos", 1000);

    
    // Es carrega el contingut del server
    this.firService.usuariActual().then(usr => {

      // Guardar nom i cognoms junt separats amb un _, fer split
      if (usr['displayName']) {
        let nomComplet = usr['displayName'].split("_");
        this.perfil.nom = nomComplet[0];
        this.perfil.cognoms = nomComplet[1];
        this.perfil.edat = nomComplet[2];
      }

      // Es canvia l'imatge de perfil
      this.perfil.imatge = "/assets/profile/avatar.png";
    }).catch(err => {
      console.log("ERROR CONTROLAT 113: ", err)
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
        displayName: (nom + "_" + cognom + "_" + edat)
      })
    }).catch(err => {
      console.log("ERROR CONTROLAT 155: ", err)
    })

    this.cancelar();
  }

  validador(params) {

    if (this.teError == 0) {
      document.getElementById('boto_dels_collons').setAttribute("disabled", "false");
    } else {
      document.getElementById('boto_dels_collons').setAttribute("disabled", "true");
    }


    let nom = this.perfil.nom;
    let cognom = this.perfil.cognoms;
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
        if (cognom.length > 40) {
          this.teError |= (1 << 3);
          return true
        }
        this.teError &= ~(1 << 3);
        return false

      case "cognomMin":
        if (cognom.length >= 1 && cognom.length < 3) {
          this.teError |= (1 << 4);
          return true
        }
        this.teError &= ~(1 << 4);
        return false

      case "cognomInvalid":
        let k = 0;
        for (let i = 0; i < cognom.length; i++) {
          if (caractersCognomValids.includes(cognom[i])) {
            k++;
          }
        }

        if ((k != cognom.length)) {
          this.teError |= (1 << 5);
        }
        else {
          this.teError &= ~(1 << 5);
        }

        return (k != cognom.length);

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




}
