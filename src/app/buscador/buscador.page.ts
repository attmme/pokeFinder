import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { MenuController } from '@ionic/angular';

import { Toast } from '../shared/toast/toast';

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
  toast = new Toast();
  arrPokemonsFiltrats = []

  constructor(
    private router: Router,
    public modalController: ModalController,
    public service: AuthService,
    public firebase: FirebaseService,
    private firestore: AngularFirestore,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    public alertController: AlertController,
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

    this.filtratPokemons(buscador, pokemon);

    return filtrat;
  }

  // ------------------------------------------------------------------ <pokemon>
  llegirPokemonFirestore() {
    let ruta = `/users/${this.service.getToken()}/pokemons/`;

    this.firebase.readColl(ruta).then(
      (dada) => {
        this.sliderPokemons.pokemons = [];
        dada.map((pokemon) => {
          this.sliderPokemons.pokemons.unshift(pokemon);
        });

        // Movem el pokemon capturat
        let t = localStorage.getItem('index_pokemon');
        if (Number(t) >= 0) {
          this.click_pokemon(this.slideWithNav, t);
        }

        // working
        /*         
        if (Number(t) >= 0) {
          this.click_pokemon(this.slideWithNav, t);
        } 
        */

      }
    );
  }

  click_pokemon(slider, index) {
    if (index != null){
      let indexReal = (this.sliderPokemons.pokemons.length - 1) - index;
      slider.slideTo(indexReal, 500); // el número és la suavitat
    }
  }

  // Filtra en temps real, si només hi ha 1 tipus el clica
  filtratPokemons(_buscador: String, _pokemon: String) {
    let buscadorParseat = _buscador.toLowerCase();
    let pokemonparseat = _pokemon.toLocaleLowerCase();
    let totsPokemons = this.sliderPokemons.pokemons;
    let aplicarSeleccio = true;

    if (pokemonparseat.includes(buscadorParseat) && _buscador.length > 0) {

      // Es mira el número de pokemons que es filtraran
      let limitPush = 0;
      totsPokemons.map(el => {
        let nom = el.name.toLowerCase();

        if (nom.includes(buscadorParseat)) {

          limitPush++;

          // Per evitar que es facin push extres en l'array
          if (this.arrPokemonsFiltrats.length < limitPush) {
            this.arrPokemonsFiltrats.push(nom);
          }

        }
      })

      if (limitPush == this.arrPokemonsFiltrats.length) {
        // Si hi ha un sol tipus de pokemon en filtrats
        this.arrPokemonsFiltrats.map(el => {

          if (el != this.arrPokemonsFiltrats[0]) {
            aplicarSeleccio = false;
          }

        })
      }

      // Si s'ha complert el filtrat, es mou cap el pokemon que toca
      if (aplicarSeleccio) {
        this.sliderPokemons.pokemons.map(el => {

          if (el.name.toLowerCase() == this.arrPokemonsFiltrats[0]) {
            aplicarSeleccio = false;
            this.click_pokemon(this.slideWithNav, el.index);
          }
        })
      }

      // Reset
      this.arrPokemonsFiltrats = [];
    }

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
    this.router.navigateByUrl('/login'); // trucazo
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

        this.firebase.eliminarUsuari().then(() => {

          this.firebase.removeCollUsuari(id, dada.length).then(() => {
            this.logout();
          }
          ).catch(
            (e) => {

            }
          );
        })
          .catch((e) => {
            this.toast.show("Esta operación es peligrosa, haz login y borra", 3000);
            // this.showToast("Esta operación es peligrosa, haz login y borra", 3000);
            this.logout();
          });
      })
      .catch((e) => {
        // console.log("e1: ", e);
      });
  }
  // ------------------------------------------------------------------ </usuari>
}
