import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';

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
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png'
        },
        {
          id: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png'
        }
      ]
    };
  }

  temp()
  {
    console.log("asd");
  }
  
  ngOnInit() {
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  // To-do
  logout() {
    // To-do:  fer logout del firestore()
    // 
    this._router.navigateByUrl('/login'); // trucazo
  }

/*   async obrir_modal_perfil() {
    const modal = await this.modalController.create({
      component: PerfilPage,
      cssClass: 'class-modal-perfil',
      componentProps: {
        'titol': 'Modal profile',
        'contingut': '',
      }
    });
    return await modal.present();
  } */

    async obrir_modal_perfil() {
      const modal = await this.modalController.create({
        component: PerfilPage,
      });
      
      return await modal.present();
    }



  // ------------------------------------------------------------------ <tmp>
  //Move to Next slide
  slideNext(/* object, */ slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(this.sliderOne /*  */, slideView);
    });
  }

  //Move to previous slide
  slidePrev(/* object, */ slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(/* object */this.sliderOne, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(/* object, */ slideView) {
    this.checkIfNavDisabled(/* object */ this.sliderOne, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
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
  // ------------------------------------------------------------------ </tmp>

}
