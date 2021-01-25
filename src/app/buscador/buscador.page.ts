import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, MenuController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  sliderOne: any;

  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };

  constructor(
    private _router: Router,
    private menu: MenuController,
    public modalController: ModalController
  ) {

    //Item object for Nature
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png'
        }
      ]
    };

  }

  pokemons = [
    {
      image: '',
      name: 'asd',
    },
    {
      image: '',
      name: 'aaa',
    },
    {
      image: '',
      name: 'bbb',
    },
    {
      image: '',
      name: 'ccc',
    },
    {
      image: '',
      name: 'ddd',
    },
    {
      image: '',
      name: 'ddd',
    },
    {
      image: '',
      name: 'ddd',
    },
    {
      image: '',
      name: 'ddd',
    },
    {
      image: '',
      name: 'ddd',
    },
  ];

  ngOnInit() {
  }

  loadData(event) {
    /*     setTimeout(() => {
          console.log('Done');
          event.target.complete();
    
          // App logic to determine if all data is loaded
          // and disable the infinite scroll
          if (this.data.length == 4) {
            event.target.disabled = true;
          }
        }, 500); */
  }

  // To-do
  logout() {
    // To-do:  fer logout del firestore()
    // 
    this._router.navigateByUrl('/login'); // trucazo
  }

  // ------------------------------------------------------------------ <modal>
  async obrir_modal_perfil() {
    const modal = await this.modalController.create({
      component: PerfilPage,
    });

    return await modal.present();
  }
  // ------------------------------------------------------------------ </modal>

  // 
  click_pokemon(evento) {

  }
  // 

  // ------------------------------------------------------------------ <slider>
  SlideDidChange(slideView) {
    this.checkIfNavDisabled(this.sliderOne, slideView);
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

}
