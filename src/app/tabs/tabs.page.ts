import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalQrScannerPage } from '../modal-qr-scanner/modal-qr-scanner.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

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
