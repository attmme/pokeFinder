import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/firebase/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validadors } from '../shared/validadors/validadors';
import { MissatgesErrors } from '../shared/missatgesErrors/missatgesErrors';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  err = new MissatgesErrors();
  validador = new Validadors();
  loginForm: FormGroup;

  emailIncorrecte = false;
  passwordIncorrecte = false;

  // Simulador del mat-error
  elmClicats = {
    email: false,
    password: false,
  }

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    public service: AuthService,
    private router: Router
  ) {
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
      email: this.validador.email(),
      password: this.validador.password(),
    });
  }

  login(formulari) {
    let e = formulari.form.value.email;
    let p = formulari.form.value.password;

    this.service.login(e, p).then((el) => {

      // Guardem la id en el local storage
      this.service.setToken(el.user.uid);

      // Reset
      this._router.navigateByUrl('/buscador');
      this.resetejarLogin();
    })
      .catch((err) => {
        // Usuari incorrecte
        if (err.code == 'auth/user-not-found') {
          this.emailIncorrecte = true;
        } else {
          this.emailIncorrecte = false;
        }

        // Password incorrecte
        if (err.code == 'auth/wrong-password') {
          this.passwordIncorrecte = true;
        } else {
          this.passwordIncorrecte = false;
        }
      });
  }

  registrar() {
    this.resetejarLogin();
    this.router.navigate(['/register']);
  }

  resetejarLogin() {
    this.loginForm.reset()
    this.elmClicats = {
      email: false,
      password: false,
    }
    this.emailIncorrecte = false;
    this.passwordIncorrecte = false;
  }
}
