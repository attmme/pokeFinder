import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validadors } from '../shared/validadors/validadors';
import { MissatgesErrors } from '../shared/missatgesErrors/missatgesErrors';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validador = new Validadors();
  err = new MissatgesErrors();
  
  registerForm: FormGroup;
  formulariCorrecte = false;
  mailRepetit = false;

  // Simulador del mat-error
  elmClicats = {
    email: false,
    password: false,
    confirm: false
  }

  // Text que apareix i no són errors
  llistatApartats = {
    titol: "Registro de usuario",
    boto: "Registrarse",
    ferLogin: "Ya estás registrado?",
    login: "Conéctate!"
  }

  constructor(
    private _router: Router,
    private fbService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  // Validacions
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
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
        });
    }
  }

  resetejarFormulari() {
    this.registerForm.reset();
    this.elmClicats = {
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
