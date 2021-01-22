import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { PerfilPage } from '../perfil/perfil.page';

import { Router } from '@angular/router';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  constructor(
    private _router: Router,
    private menu: MenuController,
    public modalController: ModalController
  ) { }

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

  async obrir_modal_perfil() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'class-modal-perfil',
      componentProps: {
        'titol': 'Modal profile',
        'contingut': '',
      }
    });

    return await modal.present();
  }

}
