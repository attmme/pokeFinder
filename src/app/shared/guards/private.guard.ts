import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth.service';
require('firebase/auth')

@Injectable({
  providedIn: 'root'
})
export class PrivateGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router) { }

  public canActivate() {
    if (this.authService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
