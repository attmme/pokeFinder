import { AuthService } from './../shared/services/firebase/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

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
  arrPokemonsFiltrats = [];
  userTeSessio;
  borrantDB = false;

  constructor(
    private router: Router,
    public modalController: ModalController,
    public service: AuthService,
    public firebase: FirebaseService,
    public firebaseAuth: AngularFireAuth,
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

    this.canvis_firestore_pokemon();
    localStorage.removeItem('index_pokemon');
    this.show('Cargando tus pokemon', 400);
    this.listenerUsuariTeSessio();
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

  ngAfterViewInit() {

  }

  fakePipe(buscador, pokemon) {
    let filtrat = pokemon.toLowerCase().includes(buscador.toLowerCase());

    this.filtratPokemons(buscador, pokemon);

    return filtrat;
  }

  listenerUsuariTeSessio() {

    this.firebaseAuth.onAuthStateChanged((credential) => {
      if (credential) {
        this.userTeSessio = credential;
        // console.log('User is logged in');
      }
      else {
        console.log('User sesió caducada');
        // l'usuari té la sesió caducada
        // this.toast.show("Sesión caducada", 2500);
        // this.logout();
      }
    })
  }

  // ------------------------------------------------------------------ <pokemon>
  llegirPokemonFirestore() {
    let ruta = `/users/${this.service.getToken()}/pokemons/`;

    this.firebase.readColl(ruta).then(
      (dada) => {

        if ((dada == undefined || dada.length == 0) && this.borrantDB == false) {
          this.logout(); // apagat, dóna problemes.
          // Et tira un logout quan està borrant la taula de firebase
        }
        else {
          this.sliderPokemons.pokemons = [];
          dada.map((pokemon) => {
            this.sliderPokemons.pokemons.unshift(pokemon);
          });

          // Si hi ha 0, vol dir que la sessió ha caducat
          if (this.sliderPokemons.pokemons.length <= 0) {
            this.firebase.logout();
            this.router.navigate(['/login']);
          }

          // Movem el pokemon capturat
          let t = localStorage.getItem('index_pokemon');
          if (Number(t) >= 0) {
            this.click_pokemon(this.slideWithNav, t);
          }
        }
      }
    ).catch(err => {
      // Error al llegir pokemons
    });
  }

  click_pokemon(slider, index) {
    if (index != null) {
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
            // Confirm Cancel
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

    this.borrantDB = true; // anem a borrar, evitem que el listener
    // de la db de pokemon ens tiri el logout mentres borrem

    let id = this.service.getToken();
    let ruta = `/users/${id}/pokemons/`;
    
    console.log("id: ", id);

    if (this.userTeSessio) {

      this.firebase.readColl(ruta).then(
        (dada) => {

          this.firebase.removeCollUsuari(id, dada.length)
            .then(() => {

              /*  this.firebase.eliminarUsuari().then(() => {
                 this.logout();
               }
               ).catch(
                 (e) => {
                   //  error al borrar el l'usuari de fireauth
                 }
               ); */
            })
            .catch((e) => {
              // error borrar taula pokemon + taula usuari
            });
        })
        .catch((e) => {
          // error llegir taula pokemon
        });
    }
    else {
      this.toast.show("Esta operación es peligrosa, haz login y borra", 3000);
      this.logout();
    }
  }

  // ------------------------------------------------------------------ </usuari>
}
