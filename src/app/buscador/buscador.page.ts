import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, LoadingController, ToastController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sliderPokemons: any;
  index_pokemon_capturat: any;
  input_buscador: any;

  constructor(
    private _router: Router,
    public modalController: ModalController,
    public service: AuthService,
    public firebase: FirebaseService,
    private firestore: AngularFirestore,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private toastCtrl: ToastController
  ) {


    this.sliderPokemons =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      pokemons: []
    };

    localStorage.removeItem('index_pokemon');
    this.canvis_firestore_pokemon();
    this.show('Cargando tus pokemon', 400);
  }

  async show(text, temps) {
    const loading = await this.loadingController.create({
      message: text,
      duration: temps,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  ngOnInit() {
  }

  fakePipe(buscador, pokemon) {
    let filtrat = pokemon.toLowerCase().includes(buscador.toLowerCase());
    // fer un filtrat
    return filtrat;
  }

  // ------------------------------------------------------------------ <pokemon>
  llegirPokemonFirestore() {
    let ruta = `/users/${this.service.getToken()}/pokemons/`;

    this.firebase.readColl(ruta).then(
      (dada) => {
        this.sliderPokemons.pokemons = [];
        dada.map((pokemon) => {
          this.sliderPokemons.pokemons.push(pokemon);
        });

        // working
        let t = localStorage.getItem('index_pokemon');

        if (Number(t) >= 0) {
          this.click_pokemon(this.slideWithNav, t);
        }

      }
    );
  }

  click_pokemon(slider, index) {
    slider.slideTo(index, 500); // el número és la suavitat
  }

  canvis_firestore_pokemon() {
    let ruta = `/users/${this.service.getToken()}/pokemons/`;
    let temporal = this.firestore.collection(ruta).valueChanges().subscribe((userData) => {
      this.llegirPokemonFirestore();
    });
  }
  // ------------------------------------------------------------------ </pokemon>


  // ------------------------------------------------------------------ <modal>
  async obrir_modal_perfil() {
    this.menuCtrl.close();

    const modal = await this.modalController.create({
      component: PerfilPage,
    });

    return await modal.present();
  }

  // ------------------------------------------------------------------ </modal>

  // ------------------------------------------------------------------ <slider>
  SlideDidChange(slideView) {
    this.checkIfNavDisabled(this.sliderPokemons, slideView);
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  // ------------------------------------------------------------------ </slider>

  // ------------------------------------------------------------------ <usuari>
  logout() {
    this.menuCtrl.close();

    this.service.removeToken();
    this.service.logout();
    this._router.navigateByUrl('/login'); // trucazo
  }

  async eliminarUsuari() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar cuenta',
      message: 'Vas a <strong>borrar</strong> tu cuenta. ¿Aceptar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.borrarCompteUsuari();
          }
        }
      ]
    });

    await alert.present();
  }

  borrarCompteUsuari() {
    let id = this.service.getToken();
    let ruta = `/users/${id}/pokemons/`;

    this.firebase.readColl(ruta).then(
      (dada) => {

        this.firebase.removeCollUsuari(id, dada.length)
          .then(() => {

            this.firebase.eliminarUsuari().then(
              (dada) => {
                this.logout();
              }
            ).catch(
              (e) => {
                this.showToast("Esta operación es peligrosa, haz login y borra", 3000);
                this.logout();
              }
            );
          })
          .catch((e) => {
            // console.log("e2: ", e);
          });
      })
      .catch((e) => {
        // console.log("e1: ", e);
      });
  }

  async showToast(msg, temps) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: temps
    });
    toast.present();
  }
  // ------------------------------------------------------------------ </usuari>
}
