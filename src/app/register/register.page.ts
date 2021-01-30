import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validadors } from './../validadors/validadors';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private _router: Router,
    private fbService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  registerForm: FormGroup;
  validador = new Validadors();

  // Altres variables
  formulariCorrecte = false;
  mailRepetit = false;

  // Simulador del mat-error
  elmClicats = {
    /* nom: false, */
    email: false,
    password: false,
    confirm: false
  }

  // Text d'errors
  llistatErrors = {
    /* nomBuit: "El campo del nombre no puede quedar vacío",
    nomLength: "El nombre debe de tener 3 o más carácteres",
    nomLengthMax: "El nombre no puede tener más de 20 carácteres", */
    emailBuit: "El campo del correo no puede quedar vacío",
    emailFormat: "El formato del correo no es correcto",
    emailLengthmax: "El correo no puede tener más de 40 carácteres",
    passBuit: "El campo de la contraseña no puede quedar vacío",
    passLength: "La contraseña debe de tener 6 o más dígitos",
    passLengthMax: "La contraseña no puede tener más de 32 carácteres",
    confBuit: "El campo de confirmación no puede quedar vacío",
    confErr: "La contraseña de confirmación no coincide",
    repeatMail: "El correo introducido ya está registrado"
  }

  // Text que apareix i no són errors
  llistatApartats = {
    titol: "Registro de usuario",
    boto: "Registrarse",
    ferLogin: "Ya estás registrado?",
    login: "Conéctate!"
  }

  // Validacions
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      /* nom: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]], */
      email: this.validador.email(),
      password: this.validador.password(),
      confirm: ['', [
        Validators.required,
      ]],
    },
      {
        validator: this.validador.checkPasswords("password", "confirm", this.elmClicats),
      }
    );
  }

  // Fa el registre amb firebase
  register(formulari) {

    // Passar l'objecte entrada
    if (!this.registerForm.invalid) {

      // Entrades
      let dades = {
        /* nom: formulari.form.value.nom, */
        email: formulari.form.value.email,
        password: formulari.form.value.password
      }

      // Es fa el registre
      this.fbService.registrar(dades)
        .then(() => {
          // Reset
          this.resetejarFormulari();

          this._router.navigate(['/login']);
        }).catch(err => {

          // Si el mail ja existeix
          if (err.code == "auth/email-already-in-use")
            this.mailRepetit = true;

          //console.log("error: ", err);
        });

    }
  }

  resetejarFormulari() {
    this.registerForm.reset();
    this.elmClicats = {
      /* nom: false, */
      email: false,
      password: false,
      confirm: false
    }
    this.mailRepetit = false;
  }

  login() {
    this.resetejarFormulari();
    this._router.navigate(['/login']);
  }

}
