import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

import { Router } from '@angular/router';
import { AngularFireModule } from '@angular/fire';

@Component({
  selector: 'app-modal-qr-scanner',
  templateUrl: './modal-qr-scanner.page.html',
  styleUrls: ['./modal-qr-scanner.page.scss'],
})

// https://devdactic.com/pwa-qr-scanner-ionic/
// https://blog.addpipe.com/common-getusermedia-errors/

export class ModalQrScannerPage implements OnInit {

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private http: HttpClient,
    public service: AuthService,
    public firebase: FirebaseService,
    public _router: Router,
    public ad: AngularFireModule,
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      // console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }

    this.startScan(); // revisar
  }

  closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });

    this.stopScan(); // revisar
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }

  // Helper functions
  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: `Capturat!`,
      position: 'middle',
      duration: 2500
    });
    toast.present();
  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(files: FileList) {
    const file = files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {

        this.scanResult = code.data;
        this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  async startScan() {

    // Not working on iOS standalone mode!

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      this.videoElement.srcObject = stream;
      // Required for Safari
      this.videoElement.setAttribute('playsinline', true);

      this.loading = await this.loadingCtrl.create({});
      await this.loading.present();

      this.videoElement.play();
      requestAnimationFrame(this.scan.bind(this));

    } catch (error) {
      console.log("Error, no tienes la webcam conectada o no tienes webcam");
    }
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {

      if (this.loading) {

        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.registrarPokemon(this.scanResult);
        this.showQrToast();
      } else {

        if (this.scanActive) {

          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  registrarPokemon(url) {

    this.http.get(url)
      .subscribe(data => {

        let pokemon_rebut = {
          index: '',
          image: data['sprites'].other['official-artwork'].front_default,
          name: data['name'],
          id: data['id'],
          weight: data['weight'],
          height: data['height'],
          type: data['types'][0].type.name
        };

        let ruta = `/users/${this.service.getToken()}/pokemons/`;

        this.firebase.collLength(ruta).then(
          (tamany) => {
            pokemon_rebut.index = tamany;
            this.firebase.writeDoc(ruta, tamany, pokemon_rebut);
          }
        ).catch(
          (e) => {
            console.log("Error catch registrar pokemon: ", e);
          }
        );
      });
  }


}
