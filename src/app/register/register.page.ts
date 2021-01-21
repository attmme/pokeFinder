import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../shared/services/firebase/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  mailRepetit = false;

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

/* 
    this.registerForm = this.formBuilder.group({
      usuari_form: ['', [Validators.required, Validators.minLength(2)]],
      email_form: ['', [Validators.required, Validators.email]],
      password_form: ['', [Validators.required, Validators.minLength(6)]],
      password_check_form: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validator: this.passwords_coincideixen('password_form', 'password_check_form')
    }); */

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
        //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')

        Validators.pattern('')
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
      validator: this.checkPasswords("password", "confirm"),
    });
  }

  // Acabar - Mira si els passwords coincideixen 
  //Si poses primer pass de confirmació i després el pass, no ho detecta bé
  checkPasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value != matchingControl.value) {
        matchingControl.setErrors({ passwordNotMatch: true });
      }
    }
  }

  // Acabar - Fa el registre amb firebase - un cop registrat, guarda id i va al login
  register(formulari) {

    // Passar l'objecte entrada
    if (!this.registerForm.invalid) {

      this.fbService.registrar(
        formulari.form.value.name,
        formulari.form.value.email,
        formulari.form.value.password)
        .then(() => {
          this._router.navigateByUrl('/login');
        }).catch(err => {

          // Si el mail ja existeix
          if (err.code == "auth/email-already-in-use")
            this.mailRepetit = true;

          //console.log("error: ", err);
        });
    }
    // return;

    /* 
    
    this.fbService.registrar(
      this.registerForm.value.usuari_form,
      this.registerForm.value.email_form,
      this.registerForm.value.password_form).catch((err) => {
        if (err.code == "auth/email-already-in-use")
          this.resposta_server = 1;
      })
  this.trucazo_router.navigateByUrl('/login'); // trucazo
  this.submitted = true;
    
    */

    /* 
    
     this.authService.register(form.value).subscribe((res) => {
      this.router.navigateByUrl('home');
    });
    
    */
  }
}
