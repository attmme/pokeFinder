import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/firebase/auth.service';
/* import { NativeStorage } from '@ionic-native/native-storage/ngx'; */

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  submitted = false;
  resposta_server = 0;

  constructor(
   public service: AuthService
  ) { }

  ngOnInit() {

  }

  login(formulari) {
    console.log("formulari: ", formulari);

    let e = formulari.form.value.email;
    let p = formulari.form.value.password;

    console.log("email: ", e);
    console.log("password: ", p);
     
    this.service.login(e, p).then((el) => {
      // this.resposta_server = 0; // resetejem
      console.log("retorn: ", el);
      
      // this.service.setToken(el.user.uid);
      console.log("logejat ok");
    })
      .catch((err) => {
        if (err.code == 'auth/user-not-found') {

          // this.resposta_server = 1;
          console.log("auth/user-not-found");
        }
        else if (err.code == 'auth/wrong-password') {

          // this.resposta_server = 2;
          console.log("auth/wrong-password");
        }
      });
  }
}
