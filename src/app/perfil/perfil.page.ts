import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  ) { }

  // Agafar de local
  perfil = {
    img: "https://sites.google.com/site/misitiowebdeanimales/_/rsrc/1431934328321/home/aves/pato/animal-hd-collection-329357.jpg",
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

  cancelar() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  aceptar(form) { }

  // Arreglar estils
  // Al clicar l'imatge, puguis agafar un altre de la galeria
  // Cancelar no guarda res i torna al home
  // Aceptar guarda a la bd i 

}
