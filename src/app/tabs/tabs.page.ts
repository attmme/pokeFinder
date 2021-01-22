import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';
// import { ModalPage } from '../modal/modal.page';
import { ModalQrScannerPage } from '../modal-qr-scanner/modal-qr-scanner.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  home_actiu = true;
  perfil_actiu = true;
  buscador_actiu = true;

  constructor(
    public modalController: ModalController,
  ) { }

  async obrir_modal_qr() {
    const modal = await this.modalController.create({
      component: ModalQrScannerPage,
    });

    return await modal.present();
  }
}
