import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private _router: Router,
    private fbService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  formulariCorrecte = false;

  // Text d'errors
  llistatErrors = {
    nomBuit: "El campo del nombre no puede quedar vacío",
    nomLength: "El nombre debe de tener 3 o más carácteres",
    nomLengthMax: "El nombre no puede tener más de 20 carácteres",
    emailBuit: "El campo del correo no puede quedar vacío",
    emailFormat: "El formato del correo no es correcto",
    emailLengthmax: "El correo no puede tener más de 40 carácteres",
    passBuit: "El campo de la contraseña no puede quedar vacío",
    passLength: "La contraseña debe de tener 6 o más dígitos",
    passLengthMax: "La contraseña no puede tener más de 32 carácteres",
    confBuit: "El campo de confirmación no puede quedar vacío",
    confErr: "La contraseña de confirmación no coincide",
  }

  // Text que apareix i no són errors
  llistatApartats = {
    titol: "Registrate!",
    boto: "Registrarse",
    ferLogin: "Ya estás registrado?",
  }

  // Validacions
  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        //Validators.email,
        Validators.maxLength(40),
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-].+[a-zA-Z0-9-.]+$')
        Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(32)
      ]],
      confirm: ['', [
        Validators.required,
      ]],
    }, {
      validator: this.checkPasswords("password", "confirm")
    });
  }

  // Acabar - Mira si els passwords coincideixen 
  //Si poses primer pass de confirmació i després el pass, no ho detecta bé
  checkPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordNotMatch: true });
      }
    }
  }

  // Acabar - Mira si l'email ja existeix en firebase
  alreadyExists() {

  }

  // Acabar - Fa el registre amb firebase - un cop registrat, guarda id i va al login
  register(formulari) {

    // Passar l'objecte entrada
    this.fbService.registrar(
      formulari.form.value.name,
      formulari.form.value.email,
      formulari.form.value.password)
      .then(r => {
        this._router.navigateByUrl('/login');
      }).catch((err) => {
        console.log("error: ", err);
      });

    /* 
    
     this.authService.register(form.value).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
    
    */
  }
}
