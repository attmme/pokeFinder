import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalQrScannerPage } from './modal-qr-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: ModalQrScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalQrScannerPageRoutingModule {}
