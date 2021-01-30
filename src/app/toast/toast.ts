import { ToastController } from '@ionic/angular';

export class Toast {

    toastCtrl = new ToastController();

    constructor() {

    }


    async show(msg, temps) {
        const toast = await this.toastCtrl.create({
            message: msg,
            position: 'middle',
            duration: temps
        });
        toast.present();
    }

}