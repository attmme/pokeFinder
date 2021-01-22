import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private _router: Router,
    private fbService: FirebaseService,
    private formBuilder: FormBuilder,
    public service: AuthService,
  ) { }

  submitted = false;
  resposta_server = 0;

  // Simulador del mat-error
  elmClicats = {
    email: false,
    password: false,
  }

  // Text d'errors
  llistatErrors = {
    emailBuit: "El campo del correo no puede quedar vacío",
    emailFormat: "El formato del correo no es correcto",
    emailLengthmax: "El correo no puede tener más de 40 carácteres",
    passBuit: "El campo de la contraseña no puede quedar vacío",
    passLength: "La contraseña debe de tener 6 o más dígitos",
    passLengthMax: "La contraseña no puede tener más de 32 carácteres",
    noMail: "El correo introducido no existe"
  }

  // Text que apareix i no són errors
  llistatApartats = {
    titol: "Login de usuario",
    boto: "Login",
    ferRegister: "Aún no tienes cuenta? Registrate",
    register: "aquí",
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(40),
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32)
      ]],
    }, {
      validator: () => { },
    });

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
    this._router.navigateByUrl('/buscador'); // trucazo
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
