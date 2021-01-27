import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sliderPokemons: any;

  constructor(
    private _router: Router,
    public modalController: ModalController,
    public service: AuthService,
    public firebase: FirebaseService,
  ) {

    this.sliderPokemons =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      pokemons: [
        /*      
                {
                  index: 0,
                  id: 145,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
                  name: 'Zapdos',
                },
                {
                  index: 1,
                  id: 27,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png',
                  name: 'Sandshrew',
                },
                {
                  index: 2,
                  id: 60,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png',
                  name: 'Poliwag',
                },
                {
                  index: 3,
                  id: 95,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
                  name: 'Onix',
                },
                {
                  index: 4,
                  id: 150,
                  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
                  name: 'Mewtwo',
                }
        */
      ]
    };

    this.llegirPokemonFirestore();
  }

  ngOnInit() {
  }

  // ------------------------------------------------------------------ <pokemon>
  llegirPokemonFirestore() {
    let ruta = `/users/${this.service.getToken()}/pokemons/`;

    this.firebase.readColl(ruta).then(
      (dada) => {
        dada.map((pokemon) => {
          this.sliderPokemons.pokemons.push(pokemon);
        });
      }
    );
  }
  
  click_pokemon(slider, index) {
    slider.slideTo(index, 500); // el número és la suavitat
  }
  // ------------------------------------------------------------------ </pokemon>


  // ------------------------------------------------------------------ <modal>
  async obrir_modal_perfil() {
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
    this.service.removeToken();
    this.service.logout();
    this._router.navigateByUrl('/login'); // trucazo
  }

}
