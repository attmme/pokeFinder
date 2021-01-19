import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private _router: Router,
    private fbService: FirebaseService
  ) { }

  ngOnInit() {
  }
  register(formulari) {
    console.log("formulari ", formulari.form.value);


    this.fbService.registrar(
      formulari.form.value.name,
      formulari.form.value.email,
      formulari.form.value.password)
      .then(
        (r) => {
          console.log("registrat");
          this._router.navigateByUrl('/login'); // trucazo
        }
      )
      .catch((err) => {
        console.log("error: ", err);
      })

    /* 
    
     this.authService.register(form.value).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
    
    */
  }
}
