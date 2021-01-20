import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalQrScannerPageRoutingModule } from './modal-qr-scanner-routing.module';

import { ModalQrScannerPage } from './modal-qr-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalQrScannerPageRoutingModule
  ],
  declarations: [ModalQrScannerPage]
})
export class ModalQrScannerPageModule {}
