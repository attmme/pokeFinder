import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

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

  constructor(
    private _router: Router,
    public modalController: ModalController,
    public service: AuthService,
    public firebase: FirebaseService,
    private firestore: AngularFirestore,
    public menuCtrl: MenuController,
  ) {

    this.sliderPokemons =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      pokemons: []
    };

    localStorage.removeItem('index_pokemon');
    this.canvis_firestore_pokemon();
  }

  ngOnInit() {
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
        console.log("dades: ", t);
        console.log("dades Number(t): ", Number(t));

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

  logout() {
    this.menuCtrl.close();

    this.service.removeToken();
    this.service.logout();
    this._router.navigateByUrl('/login'); // trucazo
  }

}
