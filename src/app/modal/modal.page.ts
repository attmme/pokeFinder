import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

   // Data passed in by componentProps
   @Input() titol: string;
   @Input() contingut: string;
   
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  dismiss() {

  }
}
